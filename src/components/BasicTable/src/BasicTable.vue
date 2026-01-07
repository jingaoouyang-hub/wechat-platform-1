<template>
  <div ref="wrapRef" style="height: 100%">
    <template v-if="mode === 'table'">
      <a-table
        ref="tableElRef"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
        v-bind="{ ...getProps, ...$attrs }"
        :columns="renderColumns"
        :data-source="dataSourceRef"
        :loading="showLoading ? loading : undefined"
        :pagination="pageCon"
        :scroll="getScrollRef"
        @change="tableChange"
      >
        <!--  自定义slots start-->
        <template v-for="(value, key) in $slots" #[key]="slotProps">
          <slot :name="key" v-bind="slotProps"></slot>
        </template>
        <template #emptyText>
          <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" style="height: 20vh">
            <template #description>
              {{ isEmpty ? '暂无数据' : '' }}
            </template>
          </a-empty>
        </template>
      </a-table>
    </template>
    <template v-else>
      <slot name="custom" :data="dataSourceRef"></slot>
      <div class="custom-page">
        <a-pagination
          v-model:current="pageOptions.current"
          show-quick-jumper
          :pageSize="pageOptions.pageSize"
          :total="pageOptions.total"
          :pageSizeOptions="pageOptions.pageSizeOptions"
          @change="handleChangePage"
        />
      </div>
    </template>
  </div>
</template>

<script setup name="BasicTable">
import { isFunction, isBoolean, isObject } from '@/utils/is.ts';
import { useTableScroll } from './hooks/useTableScroll.js';
import { Empty } from 'ant-design-vue';
// import { toRefs, ref, unref, watch, computed, onMounted, nextTick, onActivated} from 'vue';
const props = defineProps({
  showLoading: {
    default: true,
    type: Boolean,
  },
  apiFetch: {
    type: Function,
    default: null,
  },
  beforeFetch: {
    type: Function,
    default: null,
  },
  afterFetch: {
    type: Function,
    default: null,
  },
  // 是否自动计算
  canResize: {
    default: true,
    type: Boolean,
  },
  // 是否自动计算
  isCanResizeParent: {
    default: false,
    type: Boolean,
  },
  // tableColumns
  columns: {
    type: Array,
    default: () => [],
    required: true,
  },
  // 额外查询条件
  queryParams: {
    type: Object,
    default: () => {
      return {};
    },
  },
  // 自动refresTable
  immediate: {
    default: true,
    type: Boolean,
  },
  greyText: {
    default: false,
    type: Boolean,
  },
  scroll: {
    type: Object,
    default: null,
  },
  pagination: {
    type: [Object, Boolean],
    default: true,
  },
  dataSource: {
    default: () => [],
    type: Array,
  },
  resizeHeightOffset: {
    default: 52,
    type: [Number, String],
  },
  pageSize: {
    default: 10,
    type: [Number, String],
  },
  pageSizeOptions: {
    default: () => [],
    type: Array,
  },
  mode: {
    default: 'table',
    type: String,
  },
});

const emit = defineEmits(['fetch-error', 'fetch-success', 'change', 'register']);

let { dataSource } = toRefs(props);

// 表格ref
const tableElRef = ref(null);
// 表格外测
const wrapRef = ref(null);

const loading = ref(false); // table加载状态
const dataSourceRef = ref([]); // table数据
const resultData = ref({}); // 后端返回数据
const innerPropsRef = ref({});
const isEmpty = ref(false);

const getProps = computed(() => {
  return { ...props, ...unref(innerPropsRef) };
});

// 给表格加上过长省略
const renderColumns = computed(() =>
  props.columns.map(item => ({
    ellipsis: true,
    ...item,
  })),
);

watch(
  () => dataSource.value,
  () => {
    const { dataSource, apiFetch } = unref(getProps);
    !apiFetch && dataSource && (dataSourceRef.value = dataSource);
  },
  {
    immediate: true,
  },
);

const { getScrollRef, redoHeight } = useTableScroll(getProps, tableElRef, dataSourceRef, wrapRef);

let mounted;

onMounted(() => {
  unref(getProps).immediate && fetch();
  if (props.pageSizeOptions && props.pageSizeOptions.length > 0) {
    pageOptions.value.pageSizeOptions = props.pageSizeOptions;
  }
  nextTick(() => {
    mounted = true;
  });
});

onActivated(() => {
  if (mounted) {
    unref(getProps).immediate && fetch();
  }
});

// 页码参数
const pageOptions = ref({
  current: 1,
  pageSize: getProps.value.pageSize,
  total: 0,
  // size: 'small',
  pageSizeOptions: ['10', '20', '30', '40', '50', '100', '500'],
  showQuickJumper: true,
  showSizeChanger: true, // 显示可改变每页数量
  showTotal: total => `共 ${total} 条`, // 显示总数,
  onChange: (current, pageSize) => {
    pageOptions.value.current = current;
    pageOptions.value.pageSize = pageSize;
  },
  onShowSizeChange: (current, pageSize) => {
    pageOptions.value.current = current;
    pageOptions.value.pageSize = pageSize;
  },
});

const pageCon = computed(() => {
  return props.pagination && pageOptions.value.total > 10 ? pageOptions.value : false;
});

const tableChange = (...args) => {
  fetch();
  emit('change', ...args);
};

const fetch = opt => {
  nextTick(async () => {
    const { apiFetch, queryParams, beforeFetch, afterFetch, pagination } = unref(getProps);
    if (!apiFetch) {
      return;
    }
    try {
      loading.value = true;
      let pageParams = {};
      if (isBoolean(pagination) && !pagination) {
        pageParams = {};
      } else {
        pageParams['current'] = pageOptions.value.current;
        pageParams['size'] = pageOptions.value.pageSize;
      }
      // 判断参数为空字符串或者null时，置为undefined
      if (queryParams && isObject(queryParams)) {
        for (const field in queryParams) {
          if (queryParams[field] === '' || queryParams[field] === null) {
            queryParams[field] = undefined;
          }
        }
      }

      let params = {
        ...pageParams,
        ...queryParams,
        ...(opt?.queryParams ?? {}),
      };
      // 请求之前对数据操作
      if (beforeFetch && isFunction(beforeFetch)) {
        params = (await beforeFetch(params)) || params;
      }
      isEmpty.value = false;
      const res = await apiFetch(params);
      resultData.value = res;

      // 判断返回值是否为数组
      const isArrayResult = Array.isArray(res.data);

      let resultItems = isArrayResult ? res.data : res.data['records'];

      const resultTotal = isArrayResult ? 0 : Number(res.data['total']);

      // 假如数据变少，导致总页数变少并小于当前选中页码，通过getPaginationRef获取到的页码是不正确的，需获取正确的页码再次执行
      if (resultTotal) {
        const currentTotalPage = Math.ceil(resultTotal / pageOptions.value.pageSize);
        if (pageOptions.value.current > currentTotalPage) {
          pageOptions.value.current = currentTotalPage;
          return fetch(opt);
        }
      }

      // 对列表数据操作
      if (afterFetch && isFunction(afterFetch)) {
        resultItems = (await afterFetch(resultItems, { resData: res.data })) || resultItems;
      }
      // 表格数据赋值
      dataSourceRef.value = resultItems;

      // 表格总数
      pageOptions.value.total = resultTotal;
      if (!resultTotal) {
        isEmpty.value = true;
      }

      emit('fetch-success', {
        items: resultItems,
        total: resultTotal,
      });
      loading.value = false;
    } catch (error) {
      emit('fetch-error', error);
      dataSourceRef.value = [];
      pageOptions.value.total = 0;
      loading.value = false;
    }
  });
};

async function reloadTable(opt = {}) {
  // pageOptions.value.current = 1;
  return await fetch(opt);
}

function setProps(props) {
  innerPropsRef.value = { ...unref(innerPropsRef), ...props };
}

const handleChangePage = (current,pageSize) => {
  pageOptions.value.onChange(current,pageSize);
  fetch();
}

const tableAction = {
  reloadTable,
  fetch,
  redoHeight,
  setProps,
  loading,
  dataSourceRef,
  pageOptions,
};

emit('register', tableAction);

defineExpose(tableAction);
</script>

<style lang="less" scoped>
:deep(.ant-table) {
  td {
    color: rgba(0, 0, 0, 0.65);
  }
}
.custom-page{
  display: flex;
  justify-content: flex-end;
}
</style>
