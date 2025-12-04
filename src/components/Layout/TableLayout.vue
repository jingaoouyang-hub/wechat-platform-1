<template>
  <div ref="warpRef" :style="cssStyle" class="table-layout">
    <div v-if="$slots.header" ref="headerRef" class="table-layout-header">
      <slot name="header"></slot>
    </div>
    <div ref="contentRef" class="table-layout-content">
      <a-card style="height: 100%" :body-style="bodyStyle">
        <template #title>
          <slot name="bodyTitle"></slot>
        </template>
        <template #extra>
          <slot name="bodyExtra"></slot>
        </template>
        <div class="flex-between">
          <div v-if="$slots.tableTitle || tableTitle" class="table-layout-title">
            <slot name="tableTitle">{{ tableTitle }}</slot>
          </div>
          <div v-if="$slots.tableAction" class="mb-16">
            <slot name="tableAction"></slot>
          </div>
        </div>
        <slot></slot>
      </a-card>
    </div>
  </div>
</template>

<script setup name="PageLayout">
defineProps({
  tableTitle: {
    type: String,
    default: undefined,
  },
  cssStyle: {
    type: Object,
    default() {
      return {};
    },
  },
  bodyStyle: {
    type: Object,
    default() {
      return {
        paddingTop: '16px',
        paddingBottom: '16px',
      };
    },
  },
});
</script>

<style scoped lang="less">
.table-layout-header {
  margin-bottom: 24px;
}
.table-layout {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.table-layout-title {
  font-size: 16px;
  font-weight: bold !important;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
}
.table-layout-content {
  flex: 1;
}
</style>
