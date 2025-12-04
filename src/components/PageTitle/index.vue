<template>
  <div v-if="title || $slots.title" class="d-flex a-center title-container">
    <div class="left-title">
      <span>
        <slot name="title">{{ title }}</slot>
      </span>
      <span class="blue"></span>
    </div>

    <div class="right-action d-flex a-center flex-1">
      <slot></slot>
    </div>
    <div>
      <slot name="action"></slot>
    </div>
  </div>
</template>
<script name="page-title" setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});
const { title } = toRefs(props);
</script>
<style lang="less" scoped>
.title-container {
  border-bottom: 1px solid #e6e7ec;
  padding-bottom: 14px;
  .left-title {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #000000;
    position: relative;
    // .blue {
    //   position: absolute;
    //   bottom: -15px;
    //   width: 100%;
    //   height: 3px;
    //   left: 0;
    //   background: #1a90ff;
    //   border-radius: 2px;
    // }
  }
}
</style>
