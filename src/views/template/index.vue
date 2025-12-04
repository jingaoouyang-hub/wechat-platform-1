<template>
  <MainContent>
    <template #title>模板管理</template>
    <template #titleMore>
      <a-space :size="12">
        <a-button type="primary" @click="onEditTemplate({})">
          <template #icon>
            <PlusOutlined />
          </template>
          添加模板
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
      <BasicTable :query-params="queryData" :columns="columns" :api-fetch="postTemplatePage" @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'type'">
            {{ getArrayLabel(TemplateType, record.type) }}
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-space :size="10" class="space-btn--box">
              <a class="btn" @click="onPreview(record)">预览</a>
              <a class="btn" v-if="isAdmin" @click="onEditTemplate(record)">修改</a>
              <a class="btn text-error" v-if="isAdmin" @click="onDeleteTemplate(record.id)">删除</a>
            </a-space>
          </template>
        </template>
      </BasicTable>
      <TemplateModal ref="templateModalRef" @ok="reloadTable"></TemplateModal>
      <TemplatePreview v-model:visible="templatePreviewVisible" :content="templateContent"></TemplatePreview>
    </template>
  </MainContent>
</template>

<script setup>
import { BasicTable, useTable } from '@/components/BasicTable';
import MainContent from '@/components/main-content/index.vue';
import TemplateModal from '@/views/wechat/components/template-modal.vue';
import TemplatePreview from '@/views/wechat/components/template-preview.vue';
import { postTemplatePage, postTemplateDelete } from '@/api/wechat-manage/index';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { getArrayLabel } from '@/utils/common';
import { TemplateType } from '@/views/constant';
import { useStoreUser } from '@/store';

const [registerTable, { reloadTable, fetch }] = useTable();

const queryData = reactive({
  templateName: '',
  type: undefined,
});
const templatePreviewVisible = ref(false);
const templateContent = ref('');
const templateModalRef = ref(null);
const store = useStoreUser();
const isAdmin = computed(() => store.userInfo.userName === 'admin');
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '模板名称', dataIndex: 'templateName', key: 'templateName', width: 200, ellipsis: true },
  { title: '类型', dataIndex: 'type', key: 'type', width: 200, ellipsis: true },
  { title: '标题前缀', dataIndex: 'titlePre', key: 'titlePre', width: 200, ellipsis: true },
  { title: '操作', dataIndex: 'action', fixed: 'right', width: 300, key: 'name' },
];

const options = computed(() => {
  return [
    {
      field: 'templateName',
      component: 'Input',
      label: '模板名称',
    },
    {
      field: 'type',
      component: 'Select',
      label: '模板类型',
      componentProps: {
        showSearch: true,
        options: TemplateType,
      },
    },
  ];
});

const onQueryDataByParams = () => {
  reloadTable();
};

const onPreview = record => {
  templateContent.value = record.templateContent;
  templatePreviewVisible.value = true;
};

const onEditTemplate = (record = {}) => {
  templateModalRef.value.showModal(record);
};
// 删除角色
const onDeleteTemplate = id => {
  Modal.confirm({
    title: '系统提醒',
    content: '是否确认删除模板？',
    icon: () => createVNode(ExclamationCircleFilled),
    onOk() {
      postTemplateDelete({ id }).then(result => {
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
