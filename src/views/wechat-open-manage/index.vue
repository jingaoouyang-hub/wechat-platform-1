<template>
  <MainContent>
    <template #title>微信弹窗二维码管理</template>
    <template #titleMore>
      <a-space :size="12">
        <a-button type="primary" @click="windowModalRef.showModal({})">上传</a-button>
      </a-space>
    </template>
    <template #table>
      <BasicTable :query-params="queryData" :columns="columns" :api-fetch="postWindowFansList" @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'picUrl'">
            <a-image wdith="100px" height="100px" :src="record.picUrl"></a-image>
          </template>
           <template v-if="column.dataIndex === 'text'">
            <div v-if=" record.text" :style="{ fontSize: record.fontSize && `${record.fontSize}px`,'font-family': record.font && record.font, color: record.color && record.color}">{{ record.text }}</div>
            <div v-else>-</div>
          </template>
          <template v-if="column.dataIndex === 'enable'">
            <a-switch :checked="record.enable === 1" @change="chnageEnable(record)"></a-switch>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-space :size="10" class="space-btn--box">
              <a class="btn" v-if="isAdmin" @click="onUpdatePic(record)">修改</a>
              <a class="btn text-error" v-if="isAdmin" @click="onDeletePic(record.id)">删除</a>
            </a-space>
          </template>
        </template>
      </BasicTable>
      <WindowModal ref="windowModalRef" @ok="reloadTable"></WindowModal>
    </template>
  </MainContent>
</template>

<script setup>
import { BasicTable, useTable } from '@/components/BasicTable';
import { message, Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import MainContent from '@/components/main-content/index.vue';
import WindowModal from './components/window-modal.vue';
import {
  postWindowFansList,
  postWindowFansDelete,
  postWindowFansEnable
} from '@/api/wechat-manage/window';
import { useStoreUser } from '@/store';


const [registerTable, { reloadTable, fetch }] = useTable();
const windowModalRef = ref(null);
const queryData = reactive({});
const store = useStoreUser();
const isAdmin = computed(() => store.userInfo.userName === 'admin');
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 80, customRender: record => `${record.index + 1}` },
  { title: '图片名称', dataIndex: 'name', key: 'name', width: 200, ellipsis: true },
  { title: '图片地址', dataIndex: 'picUrl', key: 'picUrl', width: 200, ellipsis: true },
  { title: '文字描述', dataIndex: 'text', key: 'text', width: 300, ellipsis: true },
  { title: '状态', dataIndex: 'enable', key: 'enable', width: 150, ellipsis: true },
  { title: '操作', dataIndex: 'action', fixed: 'right', width: 100, key: 'name' },
];
const onDeletePic = id => {
  Modal.confirm({
    title: '系统提醒',
    content: '是否确认删除该图片？',
    icon: () => createVNode(ExclamationCircleFilled),
    onOk() {
      postWindowFansDelete({ id }).then(result => {
        if (result.code === 200) {
          message.success('删除成功');
          fetch();
        }
      });
    },
  });
};

const chnageEnable = record => {
  postWindowFansEnable({ id: record.id, enable: record.enable === 1 ? 0 : 1 }).then(() => {
    message.success(record.enable === 1 ? '禁用成功' : '启用成功');
    fetch();
  });
};

const onUpdatePic = (record) => {
  windowModalRef.value.showModal(record);
}

</script>

<style scoped lang="less">
.h-100 {
  ::v-deep .slot-content {
    background-color: #ffffff;
  }
}
</style>
