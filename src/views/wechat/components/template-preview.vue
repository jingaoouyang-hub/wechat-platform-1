<template>
  <a-modal
    class="template-preview"
    v-bind="{ ...$attrs, ...$props }"
    :title="null"
    :width="400"
    :footer="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #closeIcon>
      <div class="custom-close-icon">
        <CloseCircleOutlined />
      </div>
    </template>
    <div class="html-box" v-html="content"></div>
  </a-modal>
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
.template-preview {
  .ant-modal-body {
    padding: 12px;
  }
  .custom-close-icon {
    position: absolute;
    top: -12px;
    right: -30px;
    font-size: 24px;
    color: #fff;
  }
}
.html-box {
  height: 600px;
  overflow-y: auto;
  box-sizing: border-box;
  img {
    display: inline-block;
    width: 150px;
  }
}
</style>
