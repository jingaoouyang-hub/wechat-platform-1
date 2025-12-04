<template>
  <PageLayout :full-screen="true">
    <div class="h-100 d-flex">
      <div class="flex-shrink mr-24 h-100">
        <TreeDepart
          v-model:selected-keys="departTreeSelected"
          v-model:selected-item="departTreeSelectedItem"
          :tree-data="departTreeData"
          @update-depart-tree="getDepartTree"
        ></TreeDepart>
      </div>
      <div class="flex-1 overflow-h">
        <UserList :departTreeSelected="departTreeSelected" :departTreeSelectedItem="departTreeSelectedItem"></UserList>
      </div>
    </div>
  </PageLayout>
</template>

<script setup name="department-manage">
// 组件
import UserList from '@/views/system/power-manage/user-manage/components/user-list.vue';
import TreeDepart from './components/tree-depart.vue';

// api
import { postDepartmentPage } from '@/api/system/departmentApi';

// 部门接口
let departTreeData = ref([]);
let departTreeSelected = ref([]);
let departTreeSelectedItem = ref({});
function getDepartTree() {
  return postDepartmentPage().then(res => {
    departTreeData.value = res.data;
    return res.data;
  });
}

onMounted(() => {
  getDepartTree();
});
</script>

<style scoped lang="less">
.h-100 {
  ::v-deep .slot-content {
    background-color: #ffffff;
  }
}
</style>
