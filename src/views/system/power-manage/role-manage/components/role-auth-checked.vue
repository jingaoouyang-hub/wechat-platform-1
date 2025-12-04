<template>
  <a-tree
    :checked-keys="checkedKeys"
    checkable
    :tree-data="treeData"
    default-expand-all
    class="role-auth-tree"
    @check="onCheckTree"
  >
    <!-- { operationPermissions, title, key } -->
    <template #title="{ operationPermissions, title, key }">
      <div style="display: flex" @click.stop="">
        {{ title }}
        <div v-if="operationPermissions && operationPermissions.length" class="check-box" style="margin-left: 20px">
          <!-- @change.stop="onChangePermission($event, key, o.permissionName)" -->

          <a-checkbox
            v-for="(o, i) in operationPermissions"
            :key="`${key}${i}`"
            v-model:checked="o.granted"
            :disabled="!o.isOperable"
            @change.stop="onChangePermission($event, operationPermissions, key)"
          >
            {{ o.friendlyName }}
          </a-checkbox>
        </div>
      </div>
    </template>
  </a-tree>
</template>

<script setup>
import * as lodash from 'lodash';
const props = defineProps({
  treeDetail: {
    type: Array,
    default: () => [],
  },
});

const treeData = ref([]);
let checkedKeys = ref([]);
let halfCheckedKeys = ref([]);

// 把菜单变成树
const handleTree = datas =>
  datas.map(o => {
    let item = {
      id: o.id,
      title: o.name,
      key: o.id,
      icon: o.icon,
      checked: o.granted || false,
      operationPermissions: o.operationPermissions,
      disabled: !o.isOperable,
    };

    if (o.children) {
      item.children = handleTree(o.children);
    }
    if (o.granted) {
      if (o.children && o.children.length) {
        halfCheckedKeys.value.push(o.id);
      } else {
        checkedKeys.value.push(o.id);
      }
    }
    // updateTreeRecordData(o, keywordStr, o.id);
    // item.key = keywordStr;
    return item;
  });

// 改变权限
const onChangePermission = (/* e, operationPermissions, key*/) => {
  checkedKeys.value = [...checkedKeys.value];
};

// 选中树
const onCheckTree = (keys, info) => {
  checkedKeys.value = keys;
  halfCheckedKeys.value = info.halfCheckedKeys;
  const curRef = info.node.dataRef;
  checkChange(curRef);
  // 对子级有按钮权限的做操作
  function checkChange(checkItem) {
    if (checkItem.children) {
      checkItem.children.map(item => {
        checkChange(item);
      });
    }
    if (checkItem.operationPermissions) {
      checkItem.operationPermissions.map(item => {
        item.granted = info.checked;
      });
    }
  }
};

// 获取已勾选的菜单权限
const getAuthChecked = () => {
  const contactList = [...checkedKeys.value, ...halfCheckedKeys.value];
  const createSumbit = tree => {
    const resultTree = [];
    tree.forEach(item => {
      if (contactList.includes(item.id)) {
        resultTree.push({ granted: true, resModulePermissionName: '', resModuleId: item.id });
      }
      if (item.children && item.children.length) {
        resultTree.push(...createSumbit(item.children));
      }
      // 处理按钮权限拼接
      if (item.operationPermissions) {
        item.operationPermissions.forEach(t => {
          if (t.granted) {
            resultTree.push({
              granted: true,
              resModulePermissionName: t.permissionName,
              resModuleId: item.id,
            });
          }
        });
      }
    });
    return resultTree;
  };

  const permissions = createSumbit(treeData.value);

  // let permissions = checkedAuthorizeHandle();
  return permissions;
};

watch(
  () => props.treeDetail,
  () => {
    let treeDetail = lodash.cloneDeep(props.treeDetail);
    if (treeDetail) {
      checkedKeys.value = [];
      treeData.value = handleTree(treeDetail);
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

defineExpose({
  getAuthChecked,
});
</script>

<style scoped lang="less">
.role-auth-tree {
  :deep(.ant-tree-treenode-switcher-open) {
    .ant-tree-node-content-wrapper {
      height: auto;
    }
  }
}

.check-box {
  display: flex;
  flex-wrap: wrap;
}
</style>
