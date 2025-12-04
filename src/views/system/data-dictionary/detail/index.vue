<template>
  <a-drawer
    destroy-on-close
    :mask-closable="true"
    :keyboard="true"
    placement="right"
    v-model:visible="visible"
    :width="900"
    title="字典详情"
    :closable="false"
  >
    <template #extra><CloseOutlined class="a-link" @click="handleModalOk" /></template>

    <a-form class="c-form-look">
      <a-form-item label="字典名称">
        {{ detail.dictName }}
      </a-form-item>
      <a-form-item label="字典编码">
        {{ detail.dictCode }}
      </a-form-item>
      <a-form-item label="创建时间">
        {{ detail.gmtCreate }}
      </a-form-item>
      <a-form-item label="说明">
        {{ detail.remark }}
      </a-form-item>
    </a-form>

    <div class="modal-item-title">
      <div class="title">字典选项</div>
      <div class="more">
        <a-button type="primary" @click="handleAdd">添加选项</a-button>
      </div>
    </div>

    <BasicTable
      style="height: auto"
      :query-params="{ dictCode: detail.dictCode, level: 0 }"
      :columns="columns"
      :api-fetch="queryDictTypeChildPage"
      @register="registerTable"
      :canResize="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'itemStatus'">
          <a-switch :checked="record.itemStatus === 1" @click="handleChangeState($event, record)" />
        </template>
        <template v-if="column.key === 'action'">
          <a-space class="space-btn--box" :size="8">
            <a class="btn" @click="handleEdit(record)">编辑</a>
            <a class="btn text-error" @click="handleDel(record)">删除</a>
          </a-space>
        </template>
      </template>
    </BasicTable>
  </a-drawer>

  <a-modal
    destroy-on-close
    :mask-closable="false"
    :keyboard="false"
    v-model:visible="addVisible"
    :width="700"
    centered
    :title="isEdit ? '编辑选项' : '新增选项'"
    @ok="handleModalAddOk"
  >
    <a-form layout="vertical" :colon="false" ref="addFormRef" :model="addForm" autocomplete="off">
      <a-form-item label="选项名称" name="itemName" :rules="[{ required: true, message: '请输入选项名称' }]">
        <a-input show-count :maxlength="30" v-model:value="addForm.itemName" placeholder="请输入选项名称" />
      </a-form-item>
      <a-form-item label="选项编码" name="itemCode" :rules="[{ required: true, message: '请输入选项编码' }]">
        <a-input
          show-count
          :maxlength="30"
          v-model:value="addForm.itemCode"
          placeholder="请输入选项编码"
          :disabled="isEdit"
        />
      </a-form-item>
      <a-form-item label="排序" name="itemSort" :rules="[{ required: true, message: '请输入排序' }]">
        <a-input show-count :maxlength="5" type="number" v-model:value="addForm.itemSort" placeholder="请输入排序" />
      </a-form-item>
      <a-form-item label="状态" name="itemStatusBoolean">
        <a-switch v-model:checked="addForm.itemStatusBoolean" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ITableChildDataType, ITableDataType } from '../type';
import { createVNode, ref } from 'vue';
import { message, Modal, FormInstance } from 'ant-design-vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import {
  addDictTypeChild,
  delDictTypeChild,
  queryDictTypeChildPage,
  updateDictTypeChild,
} from '@/api/system/data-dictionary-api';
import { useTable } from '@/components/BasicTable';

const [registerTable, { fetch }] = useTable() as any;
// 查看相关
const visible = ref<boolean>(false);
const detail = ref<ITableDataType>({});
defineExpose({
  visible,
  detail,
});
const handleModalOk = (): void => {
  detail.value = {};
  visible.value = false;
};
// 查看相关 end

// 表格相关
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '字典编码', dataIndex: 'itemCode', key: 'itemCode', width: 150 },
  { title: '字典名称', dataIndex: 'itemName', key: 'itemName', width: 200 },
  { title: '排序', dataIndex: 'itemSort', key: 'itemSort', width: 100 },
  { title: '状态', dataIndex: 'itemStatus', key: 'itemStatus', width: 100 },
  { title: '操作', fixed: 'right', width: 200, dataIndex: 'action', key: 'action' },
];
const handleChangeState = (checked: boolean, record: ITableChildDataType): void => {
  record.itemStatusBoolean = checked;
  updateDictTypeChild({
    ...record,
    itemStatus: record.itemStatusBoolean ? 1 : 0,
  }).then(() => {
    addForm.value = {};
    isEdit.value = false;
    addVisible.value = false;
    fetch();
    message.success('操作成功');
  });
};
// 表格相关 end

// 删除相关
const handleDel = (params: ITableChildDataType): void => {
  Modal.confirm({
    title: '系统提醒',
    content: '删除后，数据将无法找回。确认删除？',
    icon: () => createVNode(ExclamationCircleFilled),
    onOk() {
      delDictTypeChild({
        ids: [params.id],
      }).then(() => {
        message.success('操作成功');
        fetch();
      });
    },
  });
};
// 删除相关 end

// 新增编辑相关
const addFormRef = ref<FormInstance>();
const addVisible = ref<boolean>(false);
const addForm = ref<ITableChildDataType>({});
const isEdit = ref<boolean>(false);
const handleAdd = (): void => {
  if (addForm.value) {
    addForm.value = { itemStatusBoolean: true };
    isEdit.value = false;
    addVisible.value = true;
  }
};
const handleEdit = (params: ITableChildDataType): void => {
  if (addForm.value) {
    addForm.value = { ...params, itemStatusBoolean: params.itemStatus === 1 };
    isEdit.value = true;
    addVisible.value = true;
  }
};
const handleModalAddOk = (): void => {
  addFormRef.value &&
    addFormRef.value.validateFields().then(value => {
      if (isEdit.value) {
        updateDictTypeChild({
          ...value,
          id: addForm.value.id,
          dictCode: detail.value.dictCode,
          itemStatus: value.itemStatusBoolean ? 1 : 0,
        }).then(() => {
          addForm.value = {};
          isEdit.value = false;
          addVisible.value = false;
          fetch();
          message.success('操作成功');
        });
        return;
      }
      addDictTypeChild({
        ...value,
        dictCode: detail.value.dictCode,
        itemStatus: value.itemStatusBoolean ? 1 : 0,
      }).then(() => {
        addForm.value = {};
        isEdit.value = false;
        addVisible.value = false;
        fetch();
        message.success('操作成功');
      });
    });
};
// 新增编辑相关 end
</script>

<style scoped lang="less">
:deep(.ant-card-body) {
  padding: 16px 0 0 0 !important;
}

:deep(.ant-card-bordered) {
  border: none;
}
</style>
