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
      <BasicTable :query-params="queryData" :columns="columns" :api-fetch="postCaAuthPage" @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'authResult'">
            <a-tooltip :title="record.authResult">
              <span>{{ record.authResult || '-' }}</span>
            </a-tooltip>
          </template>
          <template v-if="column.dataIndex === 'authStatus'">
            <a-tag :color="record.authStatus == 1 ? 'success' : 'error'">
              {{ record.authStatus == 1 ? '认证成功' : '认证失败' }}
            </a-tag>
          </template>
        </template>
      </BasicTable>
    </template>
  </MainContent>
</template>

<script setup name="login-log">
import { postCaAuthPage } from '@/api/system/logApi';
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
    field: 'userName',
    component: 'Input',
    label: '账号',
  },
  {
    field: 'authStatus',
    component: 'Select',
    label: '认证结果',
    componentProps: {
      options: [
        { value: 1, label: '认证成功' },
        { value: 0, label: '认证失败' },
      ],
    },
  },
  {
    field: 'authDate',
    component: 'RangePicker',
    fieldToTime: [['authStartDate', 'authEndDate']],
    label: '认证时间',
  },
];

const columns = [
  { title: '序号', dataIndex: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '账号', dataIndex: 'userName', key: 'userName', width: 150 },
  { title: '认证时间', dataIndex: 'authDate', key: 'authDate', width: 180 },
  { title: '认证结果', dataIndex: 'authStatus', key: 'authStatus', width: 150 },
  { title: '认证说明', dataIndex: 'authResult', key: 'authResult', width: 180 },
];
</script>

<style scoped lang="less"></style>
