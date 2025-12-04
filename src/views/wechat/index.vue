<template>
  <MainContent>
    <template #title>公众号管理</template>
    <template #titleMore>
      <a-space :size="12">
        <a-button type="primary" @click="onPublishBatch">
          <template #icon>
            <DeleteOutlined />
          </template>
          批量发布
        </a-button>
        <a-button type="primary" @click="onEditAccout({})">
          <template #icon>
            <PlusOutlined />
          </template>
          添加公众号
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
        :api-fetch="postAccountList"
        @register="registerTable"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <a-space :size="10" class="space-btn--box">
              <a class="btn" @click="onPublish(record)">发布草稿箱</a>
              <a class="btn" @click="onTemplateManage(record)">模板管理</a>
              <a class="btn" @click="onEditAccout(record)">修改</a>
              <a class="btn" @click="onViewPublishRecord(record)">发布记录</a>
              <a class="btn text-error" @click="onDeleteAccout(record.id)">删除</a>
            </a-space>
          </template>
        </template>
      </BasicTable>
      <AccountModal ref="accountModalRef" @ok="reloadTable"></AccountModal>
      <PublishModal ref="publishModalRef" @ok="publishCompleted"></PublishModal>
    </template>
  </MainContent>
</template>

<script setup>
import { BasicTable, useTable } from '@/components/BasicTable';
import MainContent from '@/components/main-content/index.vue';
import AccountModal from './components/account-modal.vue';
import PublishModal from './components/publish-modal.vue';
import { postAccountList, postAccountDelete } from '@/api/wechat-manage/index';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { useCheckWechatLogin } from '@/hooks/useCheckWechatLogin';
import { uniq } from 'lodash';

const [registerTable, { reloadTable, fetch }] = useTable();
const router = useRouter();
const accountModalRef = ref(null);
const publishModalRef = ref(null);
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '公众号名称', dataIndex: 'officialName', key: 'officialName', width: 200, ellipsis: true },
  { title: '粉丝数', dataIndex: 'fansNum', key: 'fansNum', width: 150, ellipsis: true },
  { title: '新增粉丝数', dataIndex: 'addFans', key: 'addFans', width: 200, ellipsis: true },
  { title: 'appId', dataIndex: 'appId', key: 'appId', width: 200, ellipsis: true },
  { title: 'appSecret', dataIndex: 'appSecret', key: 'codeappSecret', width: 200, ellipsis: true },
  { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 200, ellipsis: true },
  { title: '创建人', dataIndex: 'createdUserName', key: 'createdUserName', width: 120, ellipsis: true },
  { title: '操作', dataIndex: 'action', fixed: 'right', width: 400, key: 'name' },
];
const accountId = ref('');
provide('accountId', accountId);

const { startCheck } = useCheckWechatLogin(item => {
  jumpRecord(item);
});

const options = computed(() => {
  return [
    {
      field: 'officialName',
      component: 'Input',
      label: '公众号名称',
    },
  ];
});

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

const onPublishBatch = () => {
  publishModalRef.value.showModal(rowSelection.selectedRowKeys, true);
};

const publishCompleted = () => {
  rowSelection.selectedRowKeys = [];
  reloadTable();
};

const onQueryDataByParams = () => {
  reloadTable();
};

const queryData = reactive({
  officialName: '',
});

const onEditAccout = (record = {}) => {
  accountModalRef.value.showModal(record, false);
};

const onDeleteAccout = id => {
  Modal.confirm({
    title: '系统提醒',
    content: '是否确认删除该公众号？',
    icon: () => createVNode(ExclamationCircleFilled),
    onOk() {
      postAccountDelete({ id }).then(result => {
        if (result.code === 200) {
          message.success('删除成功');
          fetch();
        }
      });
    },
  });
};

const onTemplateManage = record => {
  router.push({
    path: '/wechat/template-manage',
    query: {
      id: record.id,
      officialName: record.officialName,
    },
  });
};

const onPublish = record => {
  accountId.value = record.id;
  publishModalRef.value.showModal(record);
};

const onViewPublishRecord = item => {
  startCheck(item);
};

const jumpRecord = record => {
  router.push({
    path: '/wechat/publish-record',
    query: {
      officialName: record.officialName,
    },
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
