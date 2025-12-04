<template>
  <a-layout>
    <GlobalHeader></GlobalHeader>
    <a-layout>
      <SideLayout></SideLayout>
      <a-layout-content class="layout-content" :class="{ 'collapsed-content': collapsed }">
        <div ref="contentRef" class="content">
          <CommonLayout></CommonLayout>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup name="Layout">
// 方法
import { getViewportOffset } from '@/utils/domUtils.ts';

// 仓库数据
import { useStoreApp } from '@/store';
const storeApp = useStoreApp();

// 缩放开关
const collapsed = computed(() => storeApp.collapsed);

let contentRef = ref();
const updateContentHeight = () => {
  if (contentRef.value) {
    let contentRectInfo = getViewportOffset(contentRef.value);
    storeApp.saveContentHeight(contentRectInfo.bottomIncludeBody);
  }
};
onMounted(() => {
  addEventListener('resize', updateContentHeight);
  setTimeout(() => {
    updateContentHeight();
  }, 500);
});

onUnmounted(() => {
  removeEventListener('resize', updateContentHeight);
});
</script>

<style scoped lang="less">
.layout-content {
  display: flex;
  flex-direction: column;
  padding-left: 208px;
  background: @bg-color;
  min-height: calc(100vh - 60px);

  &.collapsed-content {
    padding-left: 80px !important;
  }

  .header {
    border-bottom: 1px solid #e8e8e8;
    .route-cache-box {
      background: #ffffff;
    }
  }
  .hide-line {
    border-bottom: none;
  }

  .content {
    flex: 1;
    height: 0;
    padding: 24px;
    // overflow-y: auto;
    // overflow-x: hidden;
    // margin-bottom: 24px;
  }
}
</style>
