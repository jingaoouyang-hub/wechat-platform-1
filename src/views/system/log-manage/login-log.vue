<template>
  <MainContent :line="false" :padding="0">
    <template #search>
      <QueryFilter :options="options" :form-model="queryData" @reset="reloadTable" @submit="reloadTable">
        <a-form-item label="输入搜索" name="searchKeyword">
          <a-input v-model:value="queryData.searchKeyword" placeholder="请输入关键字搜索" />
        </a-form-item>
      </QueryFilter>
    </template>
    <template #table>
      <BasicTable :query-params="queryData" :columns="columns" :api-fetch="loginLogPage" @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'realName'">
            {{ record.realName }}{{ record.userName ? `(${record.userName})` : '' }}
          </template>
          <template v-if="column.dataIndex === 'ipAddress'">
            {{ record.ipAddress }}{{ record.ipCity ? `(${record.ipCity})` : '' }}
          </template>
          <template v-if="column.dataIndex === 'loginStatus'">
            <a-tag :color="record.loginStatus === 1 ? 'success' : 'error'">
              {{ record.loginStatus === 1 ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'statusMessage'">
            <a-tooltip :title="record.statusMessage">
              <span>{{ record.statusMessage }}</span>
            </a-tooltip>
          </template>
          <template v-if="column.dataIndex === 'result'">
            <a-tag :color="record.result === 1 ? 'success' : 'error'">
              {{ record.result === 1 ? '登录成功' : '登录失败' }}
            </a-tag>
          </template>
        </template>
      </BasicTable>
    </template>
  </MainContent>
</template>

<script setup name="login-log">
import { loginLogPage } from '@/api/system/logApi';
import MainContent from '@/components/main-content/index.vue';

import { useTable } from '@/components/BasicTable';
const [registerTable, { reloadTable }] = useTable();

const queryData = reactive({
  name: '',
  result: undefined,
  gmtCreateStartRange: [],
  gmtCreateStart: '',
  gmtCreateEnd: '',
});

const options = [
  {
    field: 'name',
    component: 'Input',
    label: '操作人',
  },
  {
    field: 'result',
    component: 'Select',
    label: '登录结果',
    componentProps: {
      options: [
        { value: 1, label: '登录成功' },
        { value: 0, label: '登录失败' },
      ],
    },
  },
  {
    field: 'gmtCreateStartRange',
    component: 'RangePicker',
    fieldToTime: [['gmtCreateStart', 'gmtCreateEnd']],
    label: '操作时间',
  },
];

const columns = [
  { title: '序号', dataIndex: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '操作人', dataIndex: 'realName', key: 'realName', width: 150 },
  { title: '登录时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 180 },
  { title: '登录结果', dataIndex: 'result', key: 'result', width: 150 },
  { title: '登录说明', dataIndex: 'remark', key: 'remark', width: 150 },
  { title: '登录地址', dataIndex: 'ipAddress', key: 'ipAddress', width: 150 },
  // {
  //   title: '登录状态',
  //   dataIndex: 'loginStatus',
  //   key: 'loginStatus',
  //   width: '80px',
  // },
];
</script>

<style scoped lang="less"></style>
