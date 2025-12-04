<template>
  <a-modal v-model:visible="visible" title="标题采集" :width="600" @ok="handleOk" @cancel="handleCancel">
    <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" :labelCol="{ style: { width: '100px' } }">
      <a-form-item label="公众号名称" name="classifyName" required>
        <a-input v-model:value="formState.classifyName" placeholder="请输入公众号名称" />
      </a-form-item>

      <a-form-item label="类型" name="type" required>
        <a-select v-model:value="formState.type" :options="TypeList" placeholder="请选择类型" />
      </a-form-item>
      <a-form-item label="标题类型" name="titleType" required>
        <a-input v-model:value="formState.titleType" placeholder="请输入标题类型" />
      </a-form-item>
      <a-form-item label="公众号列表" name="accountIds">
        <a-select
          mode="multiple"
          v-model:value="formState.accountIds"
          placeholder="请选择公众号"
          :options="accountList"
        />
      </a-form-item>
      <a-form-item label="爬取类型" name="repType" required>
        <a-radio-group v-model:value="formState.repType">
          <a-radio :value="1">全量</a-radio>
          <a-radio :value="0">自选</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
  <BasicDrawer
    v-model:visible="repVisible"
    title="公众号文章发布记录"
    :width="900"
    @ok="startCheck"
    @cancel="
      repVisible = false;
      dataSource = [];
    "
  >
    <a-table
      :rowKey="record => record.title"
      :columns="columns"
      :dataSource="dataSource"
      :rowSelection="rowSelection"
      :pagination="false"
      :scroll="{ y: 600 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'cover'">
          <a-image :src="record.cover" :width="100" referrerPolicy="no-referrer" />
        </template>
        <template v-if="column.dataIndex === 'link'">
          <a :href="text" target="_blank">{{ text }}</a>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a class="btn" @click="downloadZip(record.link)">下载</a>
        </template>
      </template>
    </a-table>
    <div class="footer-box">
      <a-pagination
        v-model:current="queryData.current"
        v-model:pageSize="queryData.size"
        :total="total"
        :pageSizeOptions="['5']"
        @change="changePageSize"
      />
    </div>
  </BasicDrawer>
</template>

<script setup>
import { postAccountPublishRecord, postAcountList } from '@/api/wechat-manage/index';
import { postRxTitleStart, postRxTitleStartCheck } from '@/api/wechat-manage/title';
import { message } from 'ant-design-vue';
import { TypeList } from '@/views/constant';
import { useCheckWechatLogin } from '@/hooks/useCheckWechatLogin';
// import { BasicTable, useTable } from '@/components/BasicTable';
import { uniq } from 'lodash';

const emit = defineEmits(['ok']);
// const [registerTable, { reloadTable }] = useTable();

const total = ref(0);
const visible = ref(false);
const formRef = ref(null);
const formState = reactive({
  classifyName: undefined,
  type: undefined,
  repType: 1,
  titleType: undefined,
  accountIds: [],
});
const queryData = reactive({
  officialName: undefined,
  size: 5,
  current: 1,
});
const repVisible = ref(false);
const rules = ref({
  classifyName: [
    {
      required: true,
      message: '请输入公众号名称',
      trigger: 'blur',
    },
  ],
  type: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'blur',
    },
  ],
  titleType: [
    {
      required: true,
      message: '请输入标题类型',
      trigger: 'blur',
    },
  ],
});
const dataSource = ref([]);
const columns = ref([
  {
    title: '标题',
    dataIndex: 'title',
    width: 150,
    ellipsis: true,
  },
  {
    title: '原文链接',
    dataIndex: 'link',
    width: 150,
    ellipsis: true,
  },
  {
    title: '封面图',
    dataIndex: 'cover',
    width: 100,
    ellipsis: true,
  },
  {
    title: '通知粉丝数',
    dataIndex: 'sentTotal',
    width: 120,
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    width: 150,
    ellipsis: true,
  },
]);

const { qrcodeLogin } = useCheckWechatLogin(() => {
  handleOk();
});

const accountList = ref([]);
const rowSelection = reactive({
  selectedRowKeys: [],
  onSelect: (values, checked) => {
    if (checked) {
      rowSelection.selectedRowKeys.push(values.title);
    } else {
      rowSelection.selectedRowKeys = rowSelection.selectedRowKeys.filter(item => item !== values.title);
    }
  },
  onSelectAll: (status, row, data) => {
    if (status) {
      rowSelection.selectedRowKeys = uniq(
        rowSelection.selectedRowKeys.concat(row.filter(t => t?.title).map(t => t.title)),
      );
    } else {
      rowSelection.selectedRowKeys = rowSelection.selectedRowKeys.filter(item => !data.find(t => t.title === item));
    }
  },
});

onMounted(() => {
  postAcountList().then(result => {
    accountList.value = result.data.map(t => {
      return {
        label: t.officialName,
        value: t.id,
      };
    });
  });
});

const changePageSize = size => {
  queryData.current = size;
  getList();
};

const getList = () => {
  postAccountPublishRecord(queryData)
    .then(res => {
      dataSource.value = res.data.records;
      total.value = res.data.total;
    })
    .catch(err => {
      if (err.code === -30000 || err.code === 520) {
        qrcodeLogin();
      }
    });
};

const handleOk = () => {
  formRef.value.validate().then(() => {
    if (formState.repType === 1) {
      postRxTitleStart(formState)
        .then(() => {
          visible.value = false;
          message.success('爬取成功');
          emit('ok');
        })
        .catch(err => {
          if (err.code === -30000 || err.code === 520) {
            qrcodeLogin();
          }
        });
    } else {
      rowSelection.selectedRowKeys = [];
      queryData.officialName = formState.classifyName;
      repVisible.value = true;
      visible.value = false;
      nextTick(() => {
        queryData.current = 1;
        getList();
      });
    }
  });
};

const startCheck = () => {
  if (rowSelection.selectedRowKeys.length === 0) {
    message.error('请选择要爬取的文章');
    return;
  }
  postRxTitleStartCheck({
    accountIds: formState.accountIds,
    type: formState.type,
    titles: rowSelection.selectedRowKeys,
  })
    .then(() => {
      repVisible.value = false;
      message.success('爬取成功');
      emit('ok');
    })
    .catch(err => {
      if (err.code === -30000 || err.code === 520) {
        qrcodeLogin();
      }
    });
};
const clearFormState = () => {
  Object.assign(formState, {
    classifyName: undefined,
    type: undefined,
    repType: 1,
    accountIds: [],
     titleType: undefined,
  });
};

const showModal = data => {
  visible.value = true;
  if (data) {
    Object.assign(formState, data);
  } else {
    clearFormState();
  }
};

const handleCancel = () => {
  visible.value = false;
  clearFormState();
};

defineExpose({
  showModal,
  visible,
});
</script>

<style lang="less" scoped>
.footer-box {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}
</style>
<style lang="less">
.ant-modal-body {
  padding: 24px 24px 0 24px;
}
</style>
