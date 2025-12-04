<template>
  <MainContent>
    <template #title>文案管理</template>
    <template #titleMore>
      <a-space :size="12">
        <a-button @click="onBatchDeleteTitle"  v-if="isAdmin">
          <template #icon>
            <DeleteOutlined />
          </template>
          批量删除
        </a-button>
        <a-button type="primary" @click="copywriteModalRef.showModal()">
          <template #icon>
            <PlusOutlined />
          </template>
          添加文案
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
        :api-fetch="postCopywritePage"
        @register="registerTable"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'type'">
            {{ getArrayLabel(CopywriteType, record.type) }}
          </template>

          <template v-if="column.dataIndex === 'action'">
            <a-space :size="10" class="space-btn--box" v-if="isAdmin">
              <a class="btn" @click="onUpdateCopywrite(record)">编辑</a>
              <a class="btn text-error" @click="onDeleteCopywrite(record.id)">删除</a>
            </a-space>
          </template>
        </template>
      </BasicTable>
      <CopywriteModal ref="copywriteModalRef" @ok="reloadTable"></CopywriteModal>
    </template>
  </MainContent>
</template>

<script setup>
import { BasicTable, useTable } from '@/components/BasicTable';
import MainContent from '@/components/main-content/index.vue';
import CopywriteModal from './components/copywrite-modal.vue';
import { postCopywritePage, postBatchDeleteCopywrite } from '@/api/wechat-manage/title';
import { postWechatAccount } from '@/api/wechat-manage/index';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { getArrayLabel } from '@/utils/common.ts';
import { CopywriteType } from '@/views/constant';
import { uniq } from 'lodash';
import { useStoreUser } from '@/store';

const [registerTable, { reloadTable, fetch }] = useTable();
const store = useStoreUser();
const isAdmin = computed(() => store.userInfo.userName === 'admin');
const copywriteModalRef = ref(null);
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '文案类型', dataIndex: 'type', key: 'type', width: 150, ellipsis: true },
  { title: '文案', dataIndex: 'copywriter', key: 'copywriter', width: 500, ellipsis: true },
  { title: '操作', dataIndex: 'action', fixed: 'right', width: 100, key: 'name' },
];
const accountList = ref([]);
const options = computed(() => {
  return [
    {
      field: 'type',
      component: 'Select',
      label: '文案类型',
      componentProps: {
        showSearch: true,
        options: CopywriteType,
        filterOption: (input, option) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
      },
    },
  ];
});
onMounted(() => {
  onSearchAccount();
});
const onQueryDataByParams = () => {
  reloadTable();
};

const queryData = reactive({
  title: '',
  accountId: undefined,
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

const onUpdateCopywrite = (record = {}) => {
  copywriteModalRef.value.showModal(record);
};

const onBatchDeleteTitle = () => {
  if (rowSelection.selectedRowKeys.length == 0) {
    message.warning('请先选择要删除的文案！');
    return;
  }
  postBatchDeleteCopywrite({ idList: rowSelection.selectedRowKeys }).then(() => {
    rowSelection.selectedRowKeys = [];
    message.success('删除成功');
    fetch();
  });
};

const onDeleteCopywrite = id => {
  Modal.confirm({
    title: '系统提醒',
    content: '是否确认删除该文案？',
    icon: () => createVNode(ExclamationCircleFilled),
    onOk() {
      postBatchDeleteCopywrite({ idList: [id] }).then(result => {
        if (result.code === 200) {
          message.success('删除成功');
          fetch();
        }
      });
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
