<template>
  <MainContent :line="false" :padding="0">
    <template #search>
      <QueryFilter :options="options" :form-model="queryData" @reset="reloadTable" @submit="reloadTable"></QueryFilter>
    </template>
    <template #table>
      <BasicTable :query-params="queryData" :columns="columns" :api-fetch="operationLogPage" @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'realName'">
            {{ record.realName }}{{ record.userName ? `(${record.userName})` : '' }}
          </template>
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="record.status === 1 ? 'green' : 'red'">
              {{ record.status === 1 ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'ipAddress'">
            {{ record.ipAddress }}{{ record.ipCity ? `(${record.ipCity})` : '' }}
          </template>
        </template>
      </BasicTable>
    </template>
  </MainContent>
</template>

<script setup name="operation-log">
import { operationLogPage, operationLogModule, operationTypeList } from '@/api/system/logApi';
import MainContent from '@/components/main-content/index.vue';

import { useTable } from '@/components/BasicTable';
const [registerTable, { reloadTable }] = useTable();

const queryData = reactive({
  gmtCreateStart: '',
  gmtCreateEnd: '',
  module: '',
  name: '',
  type: '',
});

const operationTypeOption = ref([]);
const moduleOption = ref([]);

onMounted(() => {
  operationLogModule().then(res => {
    moduleOption.value = (res.data || []).map(value => {
      return {
        label: value,
        value: value,
      };
    });
  });
  operationTypeList().then(res => {
    operationTypeOption.value = (res.data || []).map(value => {
      return {
        label: value,
        value: value,
      };
    });
  });
});
const options = computed(() => {
  return [
    {
      field: 'name',
      component: 'Input',
      label: '操作人',
    },
    {
      field: 'type',
      component: 'Select',
      label: '操作类型',
      componentProps: {
        options: operationTypeOption.value,
      },
    },
    {
      field: 'module',
      component: 'Select',
      label: '模块',
      componentProps: {
        options: moduleOption.value,
      },
    },
    {
      field: 'gmtCreateRange',
      component: 'RangePicker',
      fieldToTime: [['gmtCreateStart', 'gmtCreateEnd']],
      label: '操作时间',
    },
  ];
});

const columns = [
  { title: '序号', dataIndex: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '操作人', dataIndex: 'realName', key: 'realName', width: 150 },
  { title: '操作类型', dataIndex: 'type', key: 'type', width: 150 },
  { title: '模块', dataIndex: 'module', key: 'module', width: 150 },
  { title: '操作内容', dataIndex: 'detail', key: 'detail', width: 300, ellipsis: true },
  { title: '操作时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 180 },
  { title: 'IP地址', dataIndex: 'ipAddress', key: 'ipAddress', width: 200 },
];
</script>

<style scoped lang="less"></style>
