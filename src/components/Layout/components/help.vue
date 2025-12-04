<template>
  <div class="help-box">
    <a-tooltip placement="bottom">
      <template #title>
        <span>帮助中心</span>
      </template>
      <QuestionCircleOutlined class="icon" @click="handleClick" />
    </a-tooltip>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import { notification } from 'ant-design-vue';

const handleClick = (): void => {
  const { origin, pathname } = window.location;
  // eslint-disable-next-line
  if (import.meta.env.MODE === 'development') {
    window.open('http://192.168.0.54:9008/docs/default/');
    return;
  }
  window.open(`${origin}${pathname}docs/default/`);
};

const handleWSMessage = value => {
  const data = JSON.parse(value.data);
  if (data.action === 'sys_document_build_notify') {
    notification[data.ext.success ? 'success' : 'error']({
      message: '构建通知',
      description: data.ext.msg,
      duration: 6,
    });
  }
};
window['_SOCKET'] && window['_SOCKET'].ws.addEventListener('message', handleWSMessage);
onBeforeUnmount(() => {
  window['_SOCKET'] && window['_SOCKET'].ws.removeEventListener('message', handleWSMessage);
});
</script>

<style scoped lang="less">
.help-box {
  display: flex;
  justify-content: center;
  align-items: center;

  .icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    font-size: 16px;
    border-radius: 50%;
    background-color: @label-color;
    cursor: pointer;

    &:hover {
      background-color: @light-primary-color;
      color: @primary-color;
    }
  }
}
</style>
