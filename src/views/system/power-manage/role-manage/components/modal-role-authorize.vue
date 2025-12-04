<template>
  <a-modal
    destroy-on-close
    :mask-closable="false"
    :keyboard="false"
    v-model:visible="visible"
    :title="`角色授权（${data.name}）`"
    :width="1200"
    @ok="onSaveRoleAuthorize"
  >
    <!-- <div v-if="visible" class="authorize-tree">
      <a-tabs v-model:activeKey="activeKey" destroy-inactive-tab-pane style="height: 100%;">
        <a-tab-pane v-for="(item, index) in roleResTree" :key="index+''" :tab="item.name" :force-render="true">

        </a-tab-pane>
      </a-tabs>
    </div> -->
    <RoleAuthChecked ref="roleAuthRef" :tree-detail="roleResTree"></RoleAuthChecked>
  </a-modal>
</template>

<script setup>
import RoleAuthChecked from './role-auth-checked.vue';
import { postRoleAuthorize, rolePermissionTreeByUser } from '@/api/system/roleApi';
import { message } from 'ant-design-vue';
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['ok']);

const visible = ref(false);
const roleAuthRef = ref();
let roleResTree = ref([]);

// 确定 -- 保存角色权限
const onSaveRoleAuthorize = () => {
  let permissions = roleAuthRef.value.getAuthChecked();
  postRoleAuthorize({ id: props.data.id, permissions }).then(() => {
    message.success('保存成功');
    visible.value = false;
    emit('ok');
  });
};

// 监听visible
watch(
  () => visible.value,
  () => {
    if (visible.value) {
      // 获取授权树
      rolePermissionTreeByUser({
        id: props.data.id,
      }).then(res => {
        roleResTree.value = res.data;
      });
    } else {
      roleResTree.value = [];
    }
  },
);
defineExpose({
  visible,
});
</script>

<style scoped lang="less">
.authorize-tree {
  height: 500px;
}
:deep(.ant-tabs) {
  height: 100%;
  .ant-tabs-top-content {
    height: calc(100% - 65px);
    .ant-tabs-tabpane {
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
