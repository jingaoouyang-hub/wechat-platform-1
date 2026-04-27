<template>
  <MainContent>
    <template #title>小程序图片配置</template>
    <template #titleMore>
      <a-space :size="12">
        <a-button type="primary" @click="onAddImage">
          <template #icon>
            <PlusOutlined />
          </template>
          添加图片配置
        </a-button>
      </a-space>
    </template>
    <template #table>
      <BasicTable
        rowKey="id"
        :columns="columns"
        :api-fetch="postAppletImagePage"
        @register="registerTable"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'enabled'">
            <a-tag :color="record.enabled ? 'green' : 'red'">
              {{ record.enabled ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'imageUrl'">
            <div v-if="record.imageUrl" class="image-cell">
              <img :src="record.imageUrl" alt="图片" style="max-width: 60px; max-height: 40px;" />
            </div>
            <span v-else>-</span>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-space :size="10" class="space-btn--box">
              <a class="btn" @click="onEditImage(record)">编辑</a>
              <a class="btn text-error" @click="onDeleteImage(record.id)">删除</a>
            </a-space>
          </template>
        </template>
      </BasicTable>
      <AppletImageModal ref="imageModalRef" @ok="handleModalOk" @cancel="handleModalCancel"></AppletImageModal>
    </template>
  </MainContent>
</template>

<script setup>
import { ref } from 'vue';
import { BasicTable, useTable } from '@/components/BasicTable';
import MainContent from '@/components/main-content/index.vue';
import AppletImageModal from './compoments/applet-image-modal.vue';
import { 
  postAppletImagePage, 
  postAppletImageAdd, 
  postAppletImageUpdate, 
  postAppletImageDelete 
} from '@/api/wechat-manage/applet-manage';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';

const [registerTable, { reloadTable }] = useTable();
const imageModalRef = ref(null);
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
    title: '图片名称', 
    dataIndex: 'imageName', 
    key: 'imageName', 
    width: 150, 
    ellipsis: true 
  },
  { 
    title: '图片描述', 
    dataIndex: 'imageDescription', 
    key: 'imageDescription', 
    width: 200, 
    ellipsis: true 
  },
  { 
    title: '排序序号', 
    dataIndex: 'sortOrder', 
    key: 'sortOrder', 
    width: 100, 
    ellipsis: true 
  },
  { 
    title: '图片地址', 
    dataIndex: 'imageUrl', 
    key: 'imageUrl', 
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

const onAddImage = () => {
  editingId.value = null;
  imageModalRef.value.showModal({}, false);
};

const onEditImage = (record) => {
  editingId.value = record.id;
  imageModalRef.value.showModal(record, true);
};

const onDeleteImage = (id) => {
  Modal.confirm({
    title: '系统提醒',
    content: '是否确认删除该图片配置？',
    icon: () => createVNode(ExclamationCircleFilled),
    onOk() {
      postAppletImageDelete({ id }).then(result => {
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
    ? postAppletImageUpdate(data) 
    : postAppletImageAdd(data);
    
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