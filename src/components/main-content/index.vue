<template>
  <div class="main-content" :style="{ padding: isNumber(padding) ? padding + 'px' : padding }">
    <div class="title-box" v-if="slots.title">
      <div class="title" v-if="slots.title">
        <slot name="title" />
      </div>
      <div v-if="slots.titleMore">
        <slot name="titleMore" />
      </div>
    </div>
    <div class="subTitle-btn-box" v-if="slots.subTitle || slots.subTitleMore">
      <div v-if="slots.subTitle">
        <slot name="subTitle" />
      </div>
      <div v-if="slots.subTitleMore">
        <slot name="subTitleMore" />
      </div>
    </div>

    <a-divider style="margin: 20px 0 24px 0" v-if="line" />

    <div class="search-box" v-if="slots.search">
      <slot name="search" />
    </div>

    <div class="table-box" v-if="slots.table">
      <slot name="table" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, PropType, useSlots } from 'vue';

defineProps({
  line: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  padding: {
    type: (Number as PropType<number>) || (String as PropType<string>),
    default: 32,
  },
});

const slots = useSlots();

// 判断是不是数字类型
const isNumber = (value: string | number): boolean => {
  return Number(value)?.toString() !== 'NaN';
};
</script>

<style scoped lang="less">
.main-content {
  width: 100%;
  height: 100%;
  min-height: 100%;
  padding: 32px;
  background: #ffffff;

  > .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 20px;
      font-weight: bold;
      color: @heading-color;
      line-height: 26px;
    }
  }

  > .subTitle-btn-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
  }

  > .search-box {
    margin-bottom: 24px;
  }

  > .table-box {
  }
}
</style>
