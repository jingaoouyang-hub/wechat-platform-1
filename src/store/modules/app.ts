import { reactive, toRefs } from 'vue';
import { defineStore } from 'pinia';
import { LOCALE_LANG } from '../mutation-types';
import { getStore, setStore } from '@/utils/stroge';
import { localeSetting } from '@/setting/localeSetting';

const lsLocaleSetting = getStore(LOCALE_LANG) || localeSetting;
export const useStoreApp = defineStore('app', () => {
  const state: any = reactive({
    loading: false, // 加载状态
    contentHeight: 0, // 容器高度
    contentSider: 0, // 容器高度
    shrink: true, // 展开状态
    collapsed: false,
    localInfo: lsLocaleSetting,
    appConfig: {
      name: '', // 名称
      description: '', // 描述
      loginPageBackgroundUrl: '', // 登录背景页
      logoUrl: '', // logo
      loginPageFontColour: '#000000', // 文字颜色
    },
    messageKey: 0,
    messagePageKey: 0,
    coverSheetFormList: [],
    informedConsent: {},
    informedSignConfig: {},
  });

  const changeValue = (type: any, value: any) => {
    state[type] = value;
  };

  const changeLocalInfo = (value: any) => {
    state.localInfo = { ...state.localInfo, ...value };
    setStore(LOCALE_LANG, state.localInfo);
  };

  const saveShrink = (value: any) => {
    state.shrink = value;
  };

  const saveContentHeight = (value: any) => {
    state.contentHeight = value;
  };

  const getAppConfig = () => {
    // configQuery().then(res => {
    const data = {};
    saveAppConfig({ ...state.appConfig, ...data });
    // });
  };

  const saveAppConfig = (value: any = {}) => {
    if (value.name) {
      document.title = '公众号运营平台';
    }
    // if (value.logoUrl) {
    //   const link: any = window.document.querySelector('link[rel*="icon"]');
    //   link.href = value.logoUrl;
    // }
    Object.assign(state.appConfig, value);
  };

  const switchCollapsed = () => {
    state.collapsed = !state.collapsed;
  };

  return {
    changeValue,
    changeLocalInfo,
    saveContentHeight,
    saveShrink,
    saveAppConfig,
    getAppConfig,
    switchCollapsed,
    ...toRefs(state),
  };
});
