<template>
  <div class="html-box">
    <div class="content" v-html="content"></div>
  </div>
</template>

<script setup>
defineProps({
  content: {
    type: String,
    default: '',
  },
});
</script>

<style lang="less">
.html-box {
  padding: 12px;

  .content {
    width: 360px;
    height: 600px;
    overflow-y: auto;
    box-sizing: border-box;
    img {
      display: inline-block;
      width: 130px;
    }
  }
}
</style>
