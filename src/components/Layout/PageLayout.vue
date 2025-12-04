<template>
  <div ref="warpRef" :style="warpStyle" class="page-layout">
    <BreadCrumb v-if="isShowBreadCrumb" class="pt-16 bread-crumb"></BreadCrumb>
    <div class="flex-shrink" :style="{ height: headerHeight + 'px' }">
      <div ref="headerRef" :style="fixStyle" class="page-layout-header">
        <slot name="title"></slot>
        <slot name="header"></slot>
      </div>
    </div>
    <div ref="contentRef" class="page-layout-content">
      <div class="w-100 layout-content">
        <PageTitle class="mb-24" v-if="pageTitle || $slots.pageTitle" :title="pageTitle">
          <template #title>
            <slot name="pageTitle"></slot>
          </template>
          <template #action>
            <slot name="pageAction"></slot>
          </template>
        </PageTitle>
        <div class="flex-1 h-0">
          <slot></slot>
        </div>
      </div>
    </div>
    <div
      v-if="$slots.footer"
      class="flex-shrink"
      :class="{ 'page-footer-warp': footerHeight }"
      :style="{ height: footerHeight + 'px' }"
    >
      <div ref="footerRef" :style="fixStyle" class="page-layout-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<script setup name="PageLayout">
// 方法

import { getViewportOffset } from '@/utils/domUtils.ts';

// 仓库数据
import { useStoreApp } from '@/store';
import BreadCrumb from '@/components/BreadCrumb/index.vue';
const storeApp = useStoreApp();
const contentHeight = computed(() => storeApp.contentHeight);
const props = defineProps({
  pageTitle: {
    type: String,
    default: '',
  },
  // 是否沾满全屏
  fullScreen: {
    default: false,
    type: Boolean,
  },
  isShowBreadCrumb: {
    default: false,
    type: Boolean,
  },
  cssStyle: {
    type: Object,
    default() {
      return {};
    },
  },
});

let warpRef = ref();
let headerRef = ref();
let footerRef = ref();

const warpStyle = computed(() => {
  return {
    height: props.fullScreen ? contentHeight.value -48 + 'px' : undefined,
    'min-height': !props.fullScreen && contentHeight.value -48 + 'px',
    ...props.cssStyle,
  };
});

const fixStyle = computed(() => {
  return {
    left: storeApp.collapsed ? '80px' : '208px',
  };
});
const headerHeight = ref(0);
const footerHeight = ref(0);

const getBlockHeight = () => {
  nextTick(() => {
    let headerRectInfo = getViewportOffset(headerRef.value);
    let footerRectInfo = getViewportOffset(footerRef.value);
    headerHeight.value = headerRectInfo.height || 0;
    footerHeight.value = footerRectInfo.height || 0;
  });
};

onMounted(() => {
  getBlockHeight();
  // 监听pan变化,判断pan上下箭头的状态
  let observer = new MutationObserver(() => {
    getBlockHeight();
  });
  observer.observe(warpRef.value, {
    attributes: true,
    subtree: true,
    childList: true,
    attributeFilter: ['style'],
    attributeOldValue: true,
  });
});
</script>

<style scoped lang="less">
.page-layout {
  display: flex;
  flex-direction: column;
}
.bread-crumb {
  padding-bottom: 0;
  margin-bottom: -8px;
}
.page-layout-header {
  position: fixed;
  right: 0;
  z-index: 2;
}

.page-layout-content {
  flex: 1;
  // padding: 24px 24px;
  height: 0;
  display: flex;
  flex-direction: column;
}
.layout-content {
  padding: 24px 32px;
  background: #ffffff;
  box-shadow: 0px 2px 16px 0px #edf0f6;
  border-radius: 6px;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.page-footer-warp {
  padding: 10px 0;

  .page-layout-footer {
    padding-bottom: 10px;
    padding-top: 10px;
  }
}
.page-layout-footer {
  background: #fff;
  bottom: 0;
  right: 0;
  position: fixed;
  z-index: 2;
  padding: 0 24px;
  border-top: 1px solid #E9E9E9;
}
</style>
