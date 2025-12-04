<template>
  <a-config-provider :locale="zh_CN" :transformCellText="transformCellText" :input="{ autocomplete: 'off' }">
    <template #renderEmpty>
      <div style="text-align: center">
        <a-empty />
      </div>
    </template>
    <a-spin :spinning="loading" :delay="0" wrapper-class-name="spin-continer" size="large" tip="Loading...">
      <router-view></router-view>
    </a-spin>
  </a-config-provider>
</template>

<script setup>
import { useStoreApp, useStoreUser } from '@/store';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
// import { useLocale } from '@/locales/useLocale';
import zh_CN from 'ant-design-vue/es/locale/zh_CN';

dayjs.locale('zh-cn');
// support Multi-language
// const { getAntdLocale } = useLocale();
// 仓库数据
const storeApp = useStoreApp();
const storeUser = useStoreUser();
const loading = computed(() => storeApp.loading);

onMounted(() => {
  if (storeUser.token) {
    storeUser.getUserInfo();
  }
  storeApp.getAppConfig();
});

const transformCellText = ({ text, column }) => {
  return column ? (text && text.length ? text : '-') : text;
};
</script>

<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //color: #0b0f26;
  width: 100%;
  height: 100%;
  min-width: 1360px;
  // overflow: hidden;
  .spin-continer {
    width: 100%;
    height: 100%;

    .ant-spin-container {
      width: 100%;
      // width: calc(100% + 2px);
      height: 100%;
    }

    > div {
      > .ant-spin {
        position: fixed !important;
        max-height: none !important;
        z-index: 9999;
      }
    }
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
