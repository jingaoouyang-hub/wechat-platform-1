<template>
  <MainContent>
    <template #title>数据字典列表</template>
    <template #titleMore>
      <a-button type="primary" v-power="['add']" @click="handleAdd">
        <template #icon>
          <PlusOutlined />
        </template>
        新增
      </a-button>
    </template>
    <template #search>
      <QueryFilter :form-model="queryData" @reset="reloadQueryData" :options="options" @submit="onQueryDataByParams">
        <!-- <a-form-item label="字典名称" name="dictName">
          <a-input v-model:value="queryData.dictName" placeholder="请输入字典名称" />
        </a-form-item>
        <a-form-item label="字典编码" name="dictCode">
          <a-input v-model:value="queryData.dictCode" placeholder="请输入字典编码" />
        </a-form-item>
        <a-form-item label="状态" name="dictStatus">
          <a-select ref="select" v-model:value="queryData.dictStatus">
            <a-select-option v-for="item in statusList" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="创建时间" name="time">
          <a-range-picker v-model:value="queryData.time" format="YYYY/MM/DD" />
        </a-form-item> -->
      </QueryFilter>
    </template>
    <template #table>
      <BasicTable
        :query-params="{ ...queryData }"
        :columns="columns"
        :api-fetch="queryDictTypePage"
        @register="registerTable"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'dictStatus'">
            <a-switch :checked="record.dictStatus === 1" @click="handleTableChangeState($event, record)" />
          </template>
          <template v-if="column.key === 'action'">
            <a-space class="space-btn--box" :size="8">
              <a class="btn" v-power="['detail']" @click="handleToDetail(record)">详情</a>
              <a class="btn" v-power="['update']" @click="handleEdit(record)">编辑</a>
              <a class="btn text-error" v-power="['delete']" @click="handleDel(record)">删除</a>
            </a-space>
          </template>
        </template>
      </BasicTable>
    </template>
  </MainContent>

  <a-modal
    destroy-on-close
    :mask-closable="false"
    :keyboard="false"
    v-model:visible="addVisible"
    :width="700"
    centered
    :title="isEdit ? '编辑字典' : '新增字典'"
    @ok="handleModalAddOk"
  >
    <a-form layout="vertical" :colon="false" ref="addFormRef" :model="detail" autocomplete="off">
      <a-form-item
        label="字典名称"
        name="dictName"
        :rules="[
          { required: true, message: '请输入字典名称' },
          { max: 30, message: '最多 30 个字符' },
        ]"
      >
        <a-input show-count :maxlength="30" v-model:value="detail.dictName" placeholder="请输入字典名称" />
      </a-form-item>
      <a-form-item
        label="字典编码"
        name="dictCode"
        :rules="[
          { required: true, message: '请输入字典编码' },
          { max: 50, message: '最多 50 个字符' },
        ]"
      >
        <a-input
          show-count
          :maxlength="50"
          v-model:value="detail.dictCode"
          placeholder="请输入字典编码"
          :disabled="isEdit"
        />
      </a-form-item>
      <a-form-item label="描述" name="remark" :rules="[{ required: false, max: 300, message: '最多 300 个字符' }]">
        <a-textarea v-model:value="detail.remark" show-count :maxlength="300" :rows="5" placeholder="请输入描述" />
      </a-form-item>
      <a-form-item label="状态" name="dictStatusBoolean">
        <a-switch v-model:checked="detail.dictStatusBoolean" />
      </a-form-item>
    </a-form>
  </a-modal>

  <DataDictionaryDetail ref="detailRef" />
</template>

<script setup lang="ts">
import { computed, createVNode, ref } from 'vue';
import { IQueryDataType, IStatusType, ITableDataType } from './type';
import { message, Modal, FormInstance } from 'ant-design-vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import DataDictionaryDetail from './detail/index.vue';
import { addDictType, delDictType, queryDictTypePage, updateDictType } from '@/api/system/data-dictionary-api';
import { useTable } from '@/components/BasicTable';
import dayjs from 'dayjs';
import MainContent from '@/components/main-content/index.vue';

const [registerTable, { reloadTable, fetch }] = useTable() as any;

// 搜索栏相关
const statusList: IStatusType[] = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '已启用',
    value: 1,
  },
  {
    label: '已停用',
    value: 0,
  },
];

const options = computed(() => {
  return [
    {
      field: 'dictName',
      component: 'Input',
      label: '字典名称',
      componentProps: {
        placeholder: '请输入字典名称',
      },
    },
    {
      field: 'dictCode',
      component: 'Input',
      label: '字典编码',
      componentProps: {
        placeholder: '请输入字典编码',
      },
    },
    {
      field: 'dictStatus',
      component: 'Select',
      label: '状态',
      componentProps: {
        placeholder: '请选择',
        options: statusList,
      },
    },
    {
      field: 'time',
      component: 'RangePicker',
      fieldToTime: [['gmtCreateStart', 'gmtCreateEnd']],
      label: '创建时间',
      componentProps: {
        // placeholder: '请选择',
        options: statusList,
      },
    },
  ];
});
const queryData = ref<IQueryDataType>({
  dictCode: '',
  dictName: '',
  dictStatus: '',
  time: [],
  gmtCreateEnd: '',
  gmtCreateStart: '',
});
const reloadQueryData = (): void => {
  queryData.value.time = [];
  reloadTable();
};
const onQueryDataByParams = (): void => {
  if (queryData.value.time?.length) {
    queryData.value.gmtCreateStart = dayjs(queryData.value.time[0]).format('YYYY-MM-DD HH:mm:ss');
    queryData.value.gmtCreateEnd = dayjs(queryData.value.time[1]).format('YYYY-MM-DD HH:mm:ss');
  }
  reloadTable();
};
// 搜索栏相关 end

// 表格相关
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '字典名称', dataIndex: 'dictName', key: 'dictName', width: 200 },
  { title: '字典编码', dataIndex: 'dictCode', key: 'dictCode', width: 150 },
  { title: '说明', dataIndex: 'remark', key: 'remark', width: 300 },
  { title: '状态', dataIndex: 'dictStatus', key: 'dictStatus', width: 150 },
  { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 200 },
  { title: '操作', fixed: 'right', width: 180, dataIndex: 'action', key: 'action' },
];
const handleTableChangeState = (checked: boolean, record: ITableDataType): void => {
  record.dictStatusBoolean = checked;
  updateDictType({
    ...record,
    dictStatus: record.dictStatusBoolean ? 1 : 0,
  }).then(() => {
    fetch();
    message.success('操作成功');
  });
};
// 表格相关 end

// 查看相关
const detailRef = ref<InstanceType<typeof DataDictionaryDetail>>();
const handleToDetail = (params: ITableDataType): void => {
  if (detailRef.value) {
    detailRef.value.visible = true;
    detailRef.value.detail = { ...params };
  }
};
// 查看相关 end

// 删除相关
const handleDel = (params: ITableDataType): void => {
  Modal.confirm({
    title: '系统提醒',
    content: '删除后，数据将无法找回。确认删除？',
    icon: () => createVNode(ExclamationCircleFilled),
    onOk() {
      delDictType({
        dictCode: params.dictCode,
        force: true,
        id: params.id,
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
const isEdit = ref<boolean>(false);
const detail = ref<ITableDataType>({});
const handleAdd = (): void => {
  detail.value = { dictStatusBoolean: true };
  isEdit.value = false;
  addVisible.value = true;
};
const handleEdit = (params: ITableDataType): void => {
  detail.value = { ...params, dictStatusBoolean: params.dictStatus === 1 };
  isEdit.value = true;
  addVisible.value = true;
};
const handleModalAddOk = (): void => {
  addFormRef.value &&
    addFormRef.value.validateFields().then(value => {
      if (isEdit.value) {
        updateDictType({
          id: detail.value.id,
          dictCode: value.dictCode,
          dictName: value.dictName,
          dictStatus: value.dictStatusBoolean ? 1 : 0,
          parentDictCode: '',
          remark: value.remark,
        }).then(() => {
          detail.value = {};
          isEdit.value = false;
          addVisible.value = false;
          fetch();
          message.success('操作成功');
        });
        return;
      }
      addDictType({
        ...value,
        dictStatus: value.dictStatusBoolean ? 1 : 0,
        parentDictCode: '',
      }).then(() => {
        detail.value = {};
        isEdit.value = false;
        addVisible.value = false;
        fetch();
        message.success('操作成功');
      });
    });
};
// 新增编辑相关 end
</script>

<style scoped lang="less"></style>
