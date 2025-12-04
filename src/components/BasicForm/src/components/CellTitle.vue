<template>
  <div class="cell-title">
    <span class="text-label" :style="labelStyle">
      {{ label }}
    </span>
    <span class="text-subLabel" :style="subLabelStyle">{{ subLabel }}</span>
  </div>
</template>

<script setup name="CellTitle">
defineProps({
  label: {
    default: '',
    type: String,
  },
  subLabel: {
    default: '',
    type: String,
  },
  labelStyle: {
    type: Object,
    default() {
      return {};
    },
  },
  subLabelStyle: {
    type: Object,
    default() {
      return {};
    },
  },
});
</script>

<style scoped lang="less">
.cell-title {
  margin-top: 24px;
  margin-bottom: 16px;
}
.text-label {
  font-size: 16px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
}
</style>
