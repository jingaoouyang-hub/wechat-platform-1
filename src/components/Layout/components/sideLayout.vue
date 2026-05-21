<template>
  <a-layout-sider :collapsed="collapsed" class="layout-slider" :width="208" :trigger="null" collapsible>
    <a-menu
      v-model:selectedKeys="checks.selectedKeys"
      v-model:openKeys="openKeysByCollapsed"
      class="menu"
      mode="inline"
      theme="light"
    >
      <SubMenu :menu-info="sidesMenus"></SubMenu>
    </a-menu>
    <div class="trigger-box">
      <MenuUnfoldOutlined v-if="collapsed" @click="storeApp.switchCollapsed" />
      <MenuFoldOutlined v-else @click="storeApp.switchCollapsed" />
    </div>
  </a-layout-sider>
</template>
<script setup name="Layout">
// 组件
import SubMenu from '@/components/Menu/index.vue';
import menuRoute from '@/router/menuRoute';

// 仓库数据
import { useStoreApp, useStoreUser } from '@/store';
const storeApp = useStoreApp();
const storeUser = useStoreUser();
// const storePermission = useStorePermission();

const menuList = computed(() =>
  storeUser.userInfo.userName !== 'admin'
    ? menuRoute.filter(t => !['user-manage', 'fans-manage', 'window-manage', 'applet-manage'].includes(t.name))
    : menuRoute,
);

const route = useRoute();
// 获取需要高亮的路由name
const routeName = computed(() => (route.meta.toRoute ? route.meta.toRoute : route.name));
// const routeName = computed(() => route.matched.map(i => i.name));
// 左侧菜单集合
const sidesMenus = computed(() => {
  return menuList.value.filter(item => item.meta && !item.meta.hidden);
});

// 缩放开关
const collapsed = computed(() => storeApp.collapsed);

// 默认选择的菜单集合
const checks = reactive({
  selectedKeys: [],
  openKeys: [],
});
function updateMenu() {
  const routes = route.matched.concat();

  // 高亮二级菜单
  checks.selectedKeys = [routeName.value];
  const openKeys = [];
  routes.forEach(item => {
    openKeys.push(item.name);
  });
  checks.openKeys = openKeys;
}

// 根据菜单缩放展示是否勾选子菜单
const openKeysByCollapsed = computed(() => (collapsed.value ? [] : checks.openKeys));

// 路由变化触发顶部菜单选中变化
watch(
  () => route,
  () => {
    updateMenu();
  },
  { deep: true, immediate: true },
);
</script>

<style scoped lang="less">
.layout-slider {
  position: fixed;
  top: 60px;
  left: 0;
  min-height: 100vh;
  z-index: 999;
  background: transparent;
  box-shadow: 2px 0px 4px 0px rgba(0, 21, 41, 0.06);
  :deep(.ant-menu-root) {
    height: calc(100vh - 60px - 40px);
    border: none;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .trigger-box {
    border-top: solid 1px @border-color-base;
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #ffffff;
    padding-left: 24px;
  }
  :deep(.ant-menu-sub.ant-menu-inline) {
    background: transparent;
  }
}
</style>
