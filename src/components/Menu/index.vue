<template>
  <template v-for="item in menuInfo" :key="item.id">
    <template v-if="item.children && item.children.length && !item.hideChildrenInMenu">
      <a-sub-menu v-if="!item.hidden" :key="item.name">
        <template #title>
          <span>
            <SvgIcon :name="item?.meta.icon" v-if="item?.meta.icon"></SvgIcon>
            <span v-if="item.meta && item.meta.title">{{ item?.meta.title }}</span>
          </span>
        </template>
        <SubMenu :menu-info="item.children"></SubMenu>
      </a-sub-menu>
    </template>
    <template v-else>
      <a-menu-item v-if="!item.hidden" :key="item.name" @click="toMenu(item)">
        <SvgIcon :name="item?.meta.icon" v-if="item?.meta.icon"></SvgIcon>
        <span v-if="item.meta">{{ item?.meta.title }}</span>
      </a-menu-item>
    </template>
  </template>
</template>
<script setup name="SubMenu">
import SubMenu from '@/components/Menu/index.vue';
// eslint-disable-next-line no-unused-vars
defineProps({
  menuInfo: {
    type: Object,
    default: () => ({}),
  },
});

const router = useRouter();
const toMenu = menuItem => {
  const { children, redirect } = menuItem;
  let curItem = menuItem;
  if (children && !redirect) {
    const target = children
      .filter(child => {
        if (!child.hidden) {
          return child;
        }
      })
      .pop();
    curItem = target || {};
  }
  router.push({ name: curItem.name });
};
</script>

<style scoped lang="less"></style>
