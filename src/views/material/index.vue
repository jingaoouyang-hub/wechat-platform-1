<template>
  <MainContent>
    <template #title>素材管理</template>
    <template #titleMore>
      <a-space :size="12">
        <a-button @click="onBatchDeleteMaterial" v-if="isAdmin">
          <template #icon>
            <DeleteOutlined />
          </template>
          批量删除
        </a-button>
        <a-button v-if="isAdmin" type="primary" @click="deteleGroupModalRef.showModal()">
          <template #icon>
            <MergeCellsOutlined />
          </template>
          删除分组
        </a-button>
        <a-button v-if="isAdmin" type="primary" @click="moveGroupModalRef.showModal()">
          <template #icon>
            <MergeCellsOutlined />
          </template>
          移动分组
        </a-button>
        <a-button type="primary" @click="moveGroup" v-if="isAdmin">
          <template #icon>
            <MergeCellsOutlined />
          </template>
          修改素材类型
        </a-button>
        <a-button type="primary" @click="mergeSelectedImage">
          <template #icon>
            <MergeCellsOutlined />
          </template>
          合成选定图片
        </a-button>
        <a-button type="primary" @click="generateRandomModalRef.showModal({})">
          <template #icon>
            <MergeCellsOutlined />
          </template>
          合成随机图片
        </a-button>
        <a-button type="primary" @click="onGatherMaterial">
          <template #icon>
            <PlusOutlined />
          </template>
          公众号采集
        </a-button>
        <a-button type="primary" @click="onEditMaterial">
          <template #icon>
            <PlusOutlined />
          </template>
          添加素材
        </a-button>
        <a-button type="primary" @click="onUploadMaterial">
          <template #icon>
            <PlusOutlined />
          </template>
          素材上传
        </a-button>
      </a-space>
    </template>
    <template #search>
      <QueryFilter
        :mode="mode"
        :show-mode="true"
        :form-model="queryData"
        :options="options"
        @changeMode="changeTableMode"
        @reset="reloadTable"
        @refresh="fetch"
        @submit="onQueryDataByParams"
      ></QueryFilter>
    </template>
    <template #table>
      <BasicTable
        ref="tableRef"
        :mode="mode"
        :query-params="queryData"
        :row-selection="rowSelection"
        rowKey="id"
        :columns="columns"
        :api-fetch="postMaterialList"
        @register="registerTable"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'picUrl'">
            <a-image :src="record.picUrl" :width="100" referrerPolicy="no-referrer" />
            <!-- <img :src="record.picUrl" width="100" referrerPolicy="no-referrer" /> -->
          </template>
          <template v-if="column.dataIndex === 'type'">
            {{ getArrayLabel(TypeList, record.type) }}
          </template>
          <template v-if="column.dataIndex === 'size'">
            {{ formatFileSize(record.size) }}
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-space :size="10" class="space-btn--box" v-if="isAdmin">
              <a class="btn text-error" @click="onDeleteMaterual(record.id)">删除</a>
            </a-space>
          </template>
        </template>
        <template #custom="{ data }">
          <div class="all-check-box">
            <a-checkbox :checked="allCheck" @change="handleCheckAll($event, data)">全选</a-checkbox>
          </div>
          <a-row :gutter="[24, 24]">
            <a-col :span="3" v-for="item in data">
              <div class="pic-box">
                <a-checkbox
                  :checked="rowSelection.selectedRowKeys.includes(item.id)"
                  class="pic-check"
                  :value="item.id"
                  @change="changePicCheck"
                ></a-checkbox>
                <a-image :src="item.picUrl" width="100%" referrerPolicy="no-referrer" />
              </div>
            </a-col>
          </a-row>
        </template>
      </BasicTable>
    </template>
  </MainContent>
  <MaterialModal ref="materialModalRef" @ok="reloadTable"></MaterialModal>
  <MaterialUploadModal ref="materialUploadModalRef" @ok="reloadTable"></MaterialUploadModal>
  <GatherModal ref="gatherModalRef" @ok="reloadTable"></GatherModal>
  <GenerateRandomModal ref="generateRandomModalRef" @ok="reloadTable"></GenerateRandomModal>
  <GenerateSelectedModal ref="generateSelectedModalRef" @ok="reloadTable"></GenerateSelectedModal>
  <MaterialMoveModal ref="materialMoveModalRef" @ok="handleMove"></MaterialMoveModal>
  <DeteleGroupModal ref="deteleGroupModalRef" @ok="reloadTable"></DeteleGroupModal>
  <MoveGroupModal ref="moveGroupModalRef" @ok="reloadTable"></MoveGroupModal>
</template>

<script setup>
import { BasicTable, useTable } from '@/components/BasicTable';
import MainContent from '@/components/main-content/index.vue';
import MaterialModal from './components/material-modal.vue';
import GatherModal from './components/gather-modal.vue';
import GenerateRandomModal from './components/generate-random-modal.vue';
import GenerateSelectedModal from './components/generate-selected-modal.vue';
import MaterialUploadModal from './components/material-upload-modal.vue';
import MaterialMoveModal from './components/material-move-modal.vue';
import DeteleGroupModal from './components/group-delete-modal.vue';
import MoveGroupModal from './components/group-move-modal.vue';
import {
  postMaterialList,
  postMaterialDelete,
  postMaterialBatchDelete,
  postMaterialMove,
} from '@/api/wechat-manage/material';
import { postMaterialTypeList } from '@/api/wechat-manage/index';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { getArrayLabel } from '@/utils/common.ts';
import { TypeList } from '@/views/constant';
import { useCheckWechatLogin } from '@/hooks/useCheckWechatLogin';
import { uniq } from 'lodash';
import { useStoreUser } from '@/store';

const [registerTable, { reloadTable, fetch }] = useTable();
const store = useStoreUser();
const isAdmin = computed(() => store.userInfo.userName === 'admin');

const materialModalRef = ref(null);
const materialUploadModalRef = ref(null);
const gatherModalRef = ref(null);
const generateRandomModalRef = ref(null);
const generateSelectedModalRef = ref(null);
const materialMoveModalRef = ref(null);
const deteleGroupModalRef = ref(null);
const moveGroupModalRef = ref(null);
const mode = ref('table');
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '素材', dataIndex: 'picUrl', key: 'picUrl', width: 200, ellipsis: true },
  { title: '类型', dataIndex: 'type', key: 'type', width: 120, ellipsis: true },
  { title: '素材类型', dataIndex: 'materialType', key: 'materialType', width: 120, ellipsis: true },
  { title: '后缀名', dataIndex: 'suffix', key: 'suffix', width: 120, ellipsis: true },
  { title: '文件大小', dataIndex: 'size', key: 'size', width: 120, ellipsis: true },
  { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 200, ellipsis: true },
  { title: '操作', dataIndex: 'action', fixed: 'right', width: 200, key: 'name' },
];
const queryData = reactive({
  type: '',
  materialType: '',
});

const { startCheck } = useCheckWechatLogin(() => {
  gatherModalRef.value.showModal();
});

const options = computed(() => {
  return [
    {
      field: 'type',
      component: 'Select',
      label: '类型',
      componentProps: {
        options: TypeList,
        onChange: onChangeType,
      },
    },
    // {
    //   field: 'materialType',
    //   component: 'Input',
    //   label: '素材类型',
    // },
    {
      field: 'materialType',
      component: 'Select',
      label: '素材类型',
      componentProps: {
        showSearch: true,
        options: materialTypeList.value,
      },
    },
  ];
});
const materialTypeList = ref([]);
const selectedRows = ref([]);
const rowSelection = reactive({
  selectedRowKeys: [],
  onSelect: (row, status) => {
    if (!status) {
      rowSelection.selectedRowKeys = rowSelection.selectedRowKeys.filter(item => item !== row.id);
      selectedRows.value = selectedRows.value.filter(item => item.id !== row.id);
    } else {
      rowSelection.selectedRowKeys.push(row.id);
      selectedRows.value.push(row);
    }
  },
  onSelectAll: (status, row, data) => {
    if (status) {
      rowSelection.selectedRowKeys = uniq(rowSelection.selectedRowKeys.concat(row.filter(t => t?.id).map(t => t.id)));

      selectedRows.value = uniq(selectedRows.value.concat(row.filter(t => t?.id)));
    } else {
      rowSelection.selectedRowKeys = rowSelection.selectedRowKeys.filter(item => !data.find(t => t.id === item));
      selectedRows.value = selectedRows.value.filter(item => !data.find(t => t.id === item.id));
    }
  },
});
const tableRef = ref(null);
const allCheck = ref(false);
const onBatchDeleteMaterial = () => {
  if (rowSelection.selectedRowKeys.length == 0) {
    message.warning('请先选择要删除的素材！');
    return;
  }
  postMaterialBatchDelete({ idList: rowSelection.selectedRowKeys }).then(() => {
    rowSelection.selectedRowKeys = [];
    message.success('删除成功');
    fetch();
  });
};
const onChangeType = type => {
  if (!type) {
    queryData.materialType = null;
  }
  postMaterialTypeList({ type }).then(result => {
    materialTypeList.value = result.data.map(t => {
      return {
        value: t,
        label: t,
      };
    });
  });
};

const onQueryDataByParams = () => {
  reloadTable();
};

const onEditMaterial = (record = {}) => {
  materialModalRef.value.showModal(record);
};

const onUploadMaterial = (record = {}) => {
  materialUploadModalRef.value.showModal(record);
};

const onDeleteMaterual = id => {
  Modal.confirm({
    title: '系统提醒',
    content: '是否确认删除该素材？',
    icon: () => createVNode(ExclamationCircleFilled),
    onOk() {
      postMaterialDelete({ id }).then(result => {
        if (result.code === 200) {
          message.success('删除成功');
          fetch();
        }
      });
    },
  });
};

const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return '0 B';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const onGatherMaterial = () => {
  startCheck();
};

const mergeSelectedImage = () => {
  if (selectedRows.value.length == 0) {
    message.warning('请先选择要合并的图片素材！');
    return;
  }
  generateSelectedModalRef.value.showModal({
    picUrls: selectedRows.value.map(item => item.picUrl),
  });
};

const moveGroup = () => {
  if (selectedRows.value.length == 0) {
    message.warning('请先选择要移动的素材！');
    return;
  }
  materialMoveModalRef.value.showModal();
};

const handleMove = data => {
  postMaterialMove({
    ...data,
    idList: rowSelection.selectedRowKeys,
  }).then(() => {
    rowSelection.selectedRowKeys = [];
    selectedRows.value = [];
    message.success('移动成功');
    reloadTable();
  });
};

const changePicCheck = data => {
  if (data.target.checked) {
    rowSelection.selectedRowKeys.push(data.target.value);
  } else {
    rowSelection.selectedRowKeys = rowSelection.selectedRowKeys.filter(item => item !== data.target.value);
  }
};

const changeTableMode = type => {
  mode.value = type;
  tableRef.value.pageOptions.pageSize = type === 'table' ? 10 : 20;
  reloadTable();
};

const handleCheckAll = (data, arr) => {
  allCheck.value = data.target.checked;
  if (allCheck.value) {
    rowSelection.selectedRowKeys = rowSelection.selectedRowKeys.concat(arr.map(t => t.id));
    rowSelection.selectedRowKeys = [...new Set(rowSelection.selectedRowKeys)];
  } else {
    rowSelection.selectedRowKeys = rowSelection.selectedRowKeys.filter(o => !arr.some(t => t.id === o));
  }
};
</script>

<style scoped lang="less">
.h-100 {
  ::v-deep .slot-content {
    background-color: #ffffff;
  }
}
.pic-box {
  position: relative;
  .pic-check {
    position: absolute;
    top: 4px;
    left: 4px;
    z-index: 99;
  }
}
.all-check-box {
  margin-bottom: 24px;
}
</style>
