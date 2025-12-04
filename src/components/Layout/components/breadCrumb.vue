<template>
  <div class="breadcrumb-box" v-show="route.meta['isShowBreadCrumb']">
    <a-button size="small" @click="router.go(-1)" v-if="breadcrumbList.length >= 2">
      <template #icon>
        <LeftOutlined />
      </template>
    </a-button>
    <a-breadcrumb class="ml-6">
      <a-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
        <a @click="handleLink(item)">{{ item.meta.title }}</a>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const breadcrumbList = ref();

watch(
  () => route.matched,
  () => {
    breadcrumbList.value = route.matched.slice(route.matched.length - 2);
  },
  {
    deep: true,
    immediate: true,
  },
);

const handleLink = (item): void => {
  if (item.path === route.path) {
    return;
  }
  router.push({
    path: item.path,
  });
};
</script>

<style scoped lang="less">
.breadcrumb-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 20px;
}
</style>
