<template>
  <MainContent>
    <template #title>微信接粉二维码管理</template>
    <template #titleMore>
      <a-space :size="12">
        <a-button type="primary" @click="fansPicModalRef.showModal()">上传</a-button>
      </a-space>
    </template>
    <template #search>
      <a-row :gutter="32">
        <a-col :span="6">
          <a-form-item label="背景图">
            <AvatarUpload v-model:model-value="bgUrl" @success="val => postFansBgSave({ bgUrl: val.picUrl })" />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item label="文案">
            <a-textarea v-model:value="fansText" :rows="5" @change="changeFansText"></a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
    </template>
    <!-- <template #search>
      <QueryFilter
        :form-model="queryData"
        :options="options"
        @reset="reloadTable"
        @submit="onQueryDataByParams"
      ></QueryFilter>
    </template> -->
    <template #table>
      <BasicTable :query-params="queryData" :columns="columns" :api-fetch="postFansPicList" @register="registerTable">
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
              <a class="btn text-error" v-if="isAdmin" @click="onDeletePic(record.id)">删除</a>
            </a-space>
          </template>
        </template>
      </BasicTable>
    </template>
  </MainContent>
  <FansPicModal ref="fansPicModalRef" @ok="fetch()"></FansPicModal>
</template>

<script setup>
import { BasicTable, useTable } from '@/components/BasicTable';
import { message, Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import MainContent from '@/components/main-content/index.vue';
import FansPicModal from './fans-pic-modal.vue';
import AvatarUpload from '@/components/Upload/AvatarUpload.vue';
import {
  postFansPicList,
  postFansPicDelete,
  postFansPicEnable,
  postFansTextGet,
  postFansBgGet,
  postFansBgSave,
  postFansTextSave,
} from '@/api/wechat-manage/fans';
import { useStoreUser } from '@/store';
import { debounce } from 'lodash';

const [registerTable, { reloadTable, fetch }] = useTable();

const queryData = reactive({});
const fansPicModalRef = ref(null);
const store = useStoreUser();
const isAdmin = computed(() => store.userInfo.userName === 'admin');
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 80, customRender: record => `${record.index + 1}` },
  { title: '图片名称', dataIndex: 'name', key: 'name', width: 200, ellipsis: true },
  { title: '图片地址', dataIndex: 'picUrl', key: 'picUrl', width: 200, ellipsis: true },
  { title: '文字描述', dataIndex: 'text', key: 'text', width: 300, ellipsis: true },
  { title: '状态', dataIndex: 'enable', key: 'enable', width: 150, ellipsis: true },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 100, ellipsis: true },
  { title: '操作', dataIndex: 'action', fixed: 'right', width: 100, key: 'name' },
];
const bgUrl = ref('');
const fansText = ref('');
onMounted(() => {
  postFansBgGet().then(result => {
    bgUrl.value = result.data.bgUrl;
  });
  postFansTextGet().then(result => {
    fansText.value = result.data.fansText;
  });
});

const onDeletePic = id => {
  Modal.confirm({
    title: '系统提醒',
    content: '是否确认删除该图片？',
    icon: () => createVNode(ExclamationCircleFilled),
    onOk() {
      postFansPicDelete({ id }).then(result => {
        if (result.code === 200) {
          message.success('删除成功');
          fetch();
        }
      });
    },
  });
};

const chnageEnable = record => {
  postFansPicEnable({ id: record.id, enable: record.enable === 1 ? 0 : 1 }).then(() => {
    message.success(record.enable === 1 ? '禁用成功' : '启用成功');
    fetch();
  });
};

const changeFansText = debounce(e => {
  postFansTextSave({ fansText: e.target.value }).then(result => {
    fansText.value = e.target.value;
  });
}, 300);
</script>

<style scoped lang="less">
.h-100 {
  ::v-deep .slot-content {
    background-color: #ffffff;
  }
}
</style>
