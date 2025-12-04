<template>
  <MainContent>
    <template #title>标题管理</template>
    <template #titleMore>
      <a-space :size="12">
        <a-button @click="onBatchDeleteTitle" v-if="isAdmin">
          <template #icon>
            <DeleteOutlined />
          </template>
          批量删除
        </a-button>

        <a-button type="primary" @click="onUniqueTitle" v-if="isAdmin">去重</a-button>
        <a-button type="primary" @click="titleSelectModalRef.showModal()">
          <template #icon>
            <PlusOutlined />
          </template>
          标题采集
        </a-button>
        <a-button type="primary" @click="onEditTitle({})">
          <template #icon>
            <PlusOutlined />
          </template>
          添加标题
        </a-button>
      </a-space>
    </template>
    <template #search>
      <QueryFilter
        :form-model="queryData"
        :options="options"
        @reset="reloadTable"
        @submit="onQueryDataByParams"
      ></QueryFilter>
    </template>
    <template #table>
      <BasicTable
        rowKey="id"
        :rowSelection="rowSelection"
        :query-params="queryData"
        :columns="columns"
        :api-fetch="postTitleList"
        @register="registerTable"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'type'">
            {{ getArrayLabel(TypeList, record.type) }}
          </template>

          <template v-if="column.dataIndex === 'action'">
            <a-space :size="10" class="space-btn--box">
              <a class="btn text-error" v-if="isAdmin" @click="onDeleteTitle(record.id)">删除</a>
            </a-space>
          </template>
        </template>
      </BasicTable>
      <TitleModal ref="TitleModalRef" @ok="reloadTable"></TitleModal>
      <TitleSelectModal ref="titleSelectModalRef" @ok="reloadTable"></TitleSelectModal>
    </template>
  </MainContent>
</template>

<script setup>
import { BasicTable, useTable } from '@/components/BasicTable';
import MainContent from '@/components/main-content/index.vue';
import TitleModal from './components/title-modal.vue';
import TitleSelectModal from './components/title-select-modal.vue';
import {
  postTitleList,
  postTitleDelete,
  postBatchDeleteTitle,
  postTitleTypeList,
  postTitleUnique,
} from '@/api/wechat-manage/title';
import { postWechatAccount } from '@/api/wechat-manage/index';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { getArrayLabel } from '@/utils/common.ts';
import { TypeList } from '@/views/constant';
import { useStoreUser } from '@/store';
import { uniq } from 'lodash';

const [registerTable, { reloadTable, fetch }] = useTable();
const store = useStoreUser();
const isAdmin = computed(() => store.userInfo.userName === 'admin');
const TitleModalRef = ref(null);
const titleSelectModalRef = ref(null);
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '标题', dataIndex: 'title', key: 'title', width: 200, ellipsis: true },
  { title: '类型', dataIndex: 'titleType', key: 'titleType', width: 200, ellipsis: true },
  { title: '公众号名称', dataIndex: 'accountName', key: 'accountName', width: 200, ellipsis: true },
  { title: '类型', dataIndex: 'type', key: 'type', width: 120, ellipsis: true },
  { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 200, ellipsis: true },
  { title: '操作', dataIndex: 'action', fixed: 'right', width: 100, key: 'name' },
];
const accountList = ref([]);
const titleType = ref([]);
const options = computed(() => {
  return [
    {
      field: 'title',
      component: 'Input',
      label: '标题',
    },
    {
      field: 'accountId',
      component: 'Select',
      label: '公众号',
      componentProps: {
        showSearch: true,
        options: accountList.value,
        filterOption: (input, option) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
      },
    },
    {
      field: 'titleType',
      component: 'Select',
      label: '标题类型',
      componentProps: {
        options: titleType.value,
      },
    },
  ];
});
onMounted(() => {
  onSearchAccount();
  postTitleTypeList().then(result => {
    titleType.value = result.data.map(t => {
      return {
        label: t,
        value: t,
      };
    });
  });
});
const onQueryDataByParams = () => {
  reloadTable();
};

const queryData = reactive({
  title: '',
  accountId: undefined,
  titleType: undefined,
});

const onSearchAccount = () => {
  postWechatAccount().then(result => {
    accountList.value = result.data.map(t => {
      return {
        label: t.officialName,
        value: t.id,
      };
    });
  });
};

const rowSelection = reactive({
  selectedRowKeys: [],
  onSelect: (row, status) => {
    if (!status) {
      rowSelection.selectedRowKeys = rowSelection.selectedRowKeys.filter(item => item !== row.id);
    } else {
      rowSelection.selectedRowKeys.push(row.id);
    }
  },
  onSelectAll: (status, row, data) => {
    if (status) {
      rowSelection.selectedRowKeys = uniq(rowSelection.selectedRowKeys.concat(row.filter(t => t?.id).map(t => t.id)));
    } else {
      rowSelection.selectedRowKeys = rowSelection.selectedRowKeys.filter(item => !data.find(t => t.id === item));
    }
  },
});

const onEditTitle = (record = {}) => {
  TitleModalRef.value.showModal(record);
};

const onBatchDeleteTitle = () => {
  if (rowSelection.selectedRowKeys.length == 0) {
    message.warning('请先选择要删除的标题！');
    return;
  }
  postBatchDeleteTitle({ idList: rowSelection.selectedRowKeys }).then(() => {
    rowSelection.selectedRowKeys = [];
    message.success('删除成功');
    fetch();
  });
};

const onDeleteTitle = id => {
  Modal.confirm({
    title: '系统提醒',
    content: '是否确认删除该标题？',
    icon: () => createVNode(ExclamationCircleFilled),
    onOk() {
      postTitleDelete({ id }).then(result => {
        if (result.code === 200) {
          message.success('删除成功');
          fetch();
        }
      });
    },
  });
};

const onUniqueTitle = () => {
  postTitleUnique().then(() => {
    message.success('去重成功');
    fetch();
  });
};
</script>

<style scoped lang="less">
.h-100 {
  ::v-deep .slot-content {
    background-color: #ffffff;
  }
}
</style>
