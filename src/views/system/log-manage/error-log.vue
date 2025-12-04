<template>
  <MainContent :line="false" :padding="0">
    <template #search>
      <QueryFilter :options="options" :form-model="queryData" @reset="reloadTable" @submit="reloadTable"></QueryFilter>
    </template>
    <template #table>
      <BasicTable :query-params="queryData" :columns="columns" :api-fetch="errorLogPage" @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space class="space-btn--box" :size="8">
              <a class="btn" @click="lookStackTrace(record)">查看</a>
            </a-space>
          </template>
        </template>
      </BasicTable>
    </template>
  </MainContent>
  <a-drawer
    destroy-on-close
    :mask-closable="true"
    :keyboard="true"
    v-model:visible="visible"
    title="日志详情"
    :width="900"
    placement="right"
    :closable="false"
  >
    <template #extra><CloseOutlined class="a-link" @click="visible = false" /></template>

    <a-form layout="vertical" ref="formRef">
      <a-form-item label="信息" name="message">
        <pre>{{ curRecord.message }}</pre>
      </a-form-item>
      <a-form-item label="栈内容" name="stackTrace">
        <pre>{{ curRecord.stackTrace }}</pre>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup name="error-log">
import { errorLogPage, errorLogDetail } from '@/api/system/logApi';
import MainContent from '@/components/main-content/index.vue';

import { useTable } from '@/components/BasicTable';

const [registerTable, { reloadTable }] = useTable();

const queryData = reactive({
  gmtCreateEnd: '',
  gmtCreateStart: '',
  gmtCreateRange: [],
  message: '',
});

const options = [
  {
    field: 'gmtCreateRange',
    component: 'RangePicker',
    fieldToTime: [['gmtCreateStart', 'gmtCreateEnd']],
    label: '日志时间',
  },
  {
    field: 'message',
    component: 'Input',
    label: '信息',
  },
];

let visible = ref(false);
let curRecord = ref({});

function lookStackTrace(record) {
  errorLogDetail({
    id: record.id,
  }).then(result => {
    curRecord.value = result.data || {};
    visible.value = true;
  });
}

const columns = [
  { title: '序号', dataIndex: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '日志时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 250 },
  { title: '信息', dataIndex: 'message', key: 'message', ellipsis: true },
  // { title: '栈内容', dataIndex: 'stackTrace', key: 'stackTrace', ellipsis: true },
  { title: '操作', fixed: 'right', width: 100, dataIndex: 'action', key: 'action' },
];
</script>

<style scoped lang="less"></style>
