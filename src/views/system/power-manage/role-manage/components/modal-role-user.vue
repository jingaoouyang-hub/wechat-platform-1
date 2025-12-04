<template>
  <a-modal
    destroy-on-close
    :mask-closable="true"
    :keyboard="true"
    v-model:visible="visible"
    :title="'查看成员'"
    :width="900"
    :footer="null"
  >
    <div class="modal-item-title">
      <div class="title" style="font-weight: normal">
        <a-input
          v-model:value="queryData.realName"
          show-count
          :maxlength="30"
          style="width: 200px"
          placeholder="请输入姓名"
          @change="reloadTable"
        />
      </div>
      <!-- <div class="more">
        <a-button type="primary" @click="reloadTable">查询</a-button>
      </div> -->
    </div>

    <BasicTable
      class="mt-16"
      :query-params="{ ...queryData, roleId }"
      :scroll="{ y: 400 }"
      :immediate="false"
      :columns="columns"
      :api-fetch="postAccountList"
      @register="registerTable"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'statusName'">
          <a-tag :color="record.status === 1 ? 'success' : 'error'">
            {{ record.status === 1 ? '启用' : '禁用' }}
          </a-tag>
        </template>
      </template>
    </BasicTable>
  </a-modal>
</template>

<script setup>
// api
import { postAccountList } from '@/api/system/accountApi';
import { useTable } from '@/components/BasicTable';
const [registerTable, { reloadTable }] = useTable();

defineProps({
  roleId: {
    type: [String, Number],
    default: 0,
  },
});

const visible = ref(false);
const queryData = reactive({
  name: '',
});

const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '姓名', dataIndex: 'realName', key: 'realName', width: 100 },
  { title: '手机号', dataIndex: 'phoneNumber', key: 'phoneNumber', width: 150 },
  { title: '机构', dataIndex: 'researchCenter', key: 'researchCenter', width: 150 },
  { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 180 },
  // { title: '状态', dataIndex: 'statusName', key: 'statusName', width: 120 },
  // { title: '操作', fixed: 'right', width: 150, dataIndex: 'action', key: 'action' },
];

function showModal() {
  visible.value = true;
  nextTick(() => {
    reloadTable();
  });
}

defineExpose({
  visible,
  showModal,
});
</script>

<style scoped lang="less"></style>
