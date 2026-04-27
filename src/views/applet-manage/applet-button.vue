<template>
  <MainContent>
    <template #title>小程序按钮配置</template>
    <template #titleMore>
      <a-space :size="12">
        <a-button type="primary" @click="onAddButton">
          <template #icon>
            <PlusOutlined />
          </template>
          添加按钮配置
        </a-button>
      </a-space>
    </template>
    <template #table>
      <BasicTable
        rowKey="id"
        :columns="columns"
        :api-fetch="postAppletButtonPage"
        @register="registerTable"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'enabled'">
            <a-tag :color="record.enabled ? 'green' : 'red'">
              {{ record.enabled ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'buttonImage'">
            <div v-if="record.buttonImage" class="image-cell">
              <img :src="record.buttonImage" alt="按钮图片" style="max-width: 60px; max-height: 40px;" />
            </div>
            <span v-else>-</span>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-space :size="10" class="space-btn--box">
              <a class="btn" @click="onEditButton(record)">编辑</a>
              <a class="btn text-error" @click="onDeleteButton(record.id)">删除</a>
            </a-space>
          </template>
        </template>
      </BasicTable>
      <AppletButtonModal ref="buttonModalRef" @ok="handleModalOk" @cancel="handleModalCancel"></AppletButtonModal>
    </template>
  </MainContent>
</template>

<script setup>
import { ref } from 'vue';
import { BasicTable, useTable } from '@/components/BasicTable';
import MainContent from '@/components/main-content/index.vue';
import AppletButtonModal from './compoments/applet-button-modal.vue';
import { 
  postAppletButtonPage, 
  postAppletButtonAdd, 
  postAppletButtonUpdate, 
  postAppletButtonDelete 
} from '@/api/wechat-manage/applet-manage';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';

const [registerTable, { reloadTable }] = useTable();
const buttonModalRef = ref(null);
const editingId = ref(null);

const columns = [
  { 
    title: '序号', 
    dataIndex: 'index', 
    key: 'index', 
    width: 60, 
    customRender: (record) => `${record.index + 1}` 
  },
  { 
    title: '按钮名称', 
    dataIndex: 'buttonName', 
    key: 'buttonName', 
    width: 150, 
    ellipsis: true 
  },
  { 
    title: '按钮文案', 
    dataIndex: 'buttonCopywriting', 
    key: 'buttonCopywriting', 
    width: 200, 
    ellipsis: true 
  },
  { 
    title: '按钮图片', 
    dataIndex: 'buttonImage', 
    key: 'buttonImage', 
    width: 120, 
    ellipsis: true 
  },
  { 
    title: '启用状态', 
    dataIndex: 'enabled', 
    key: 'enabled', 
    width: 100, 
    ellipsis: true 
  },
  { 
    title: '操作', 
    dataIndex: 'action', 
    fixed: 'right', 
    width: 150, 
    key: 'action' 
  },
];

const onAddButton = () => {
  editingId.value = null;
  buttonModalRef.value.showModal({}, false);
};

const onEditButton = (record) => {
  editingId.value = record.id;
  buttonModalRef.value.showModal(record, true);
};

const onDeleteButton = (id) => {
  Modal.confirm({
    title: '系统提醒',
    content: '是否确认删除该按钮配置？',
    icon: () => createVNode(ExclamationCircleFilled),
    onOk() {
      postAppletButtonDelete({ id }).then(result => {
        if (result.code === 200) {
          message.success('删除成功');
          reloadTable();
        }
      });
    },
  });
};

const handleModalOk = (data) => {
  const apiCall = editingId.value 
    ? postAppletButtonUpdate(data) 
    : postAppletButtonAdd(data);
    
  apiCall.then(result => {
    if (result.code === 200) {
      message.success(editingId.value ? '更新成功' : '添加成功');
      reloadTable();
    }
  });
};

const handleModalCancel = () => {
  // 模态框取消时的处理
};
</script>

<style scoped lang="less">
.image-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>