import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import Antd from 'ant-design-vue';
import Directives from './directives/index';
import CommonComponent from './components/index';
import { setupI18n } from '@/locales/setupI18n';
import 'ant-design-vue/dist/antd.less';
import './assets/style/antd.less';
import './assets/style/init.less';
import './assets/style/main.less';
import plugins from '@/plugins';
import markdownModule from '@wangeditor/plugin-md';
import { Boot } from '@wangeditor/editor';
Boot.registerModule(markdownModule);

async function bootstrap() {
  const app = createApp(App);
  app.use(CommonComponent);
  app.use(Antd);
  app.use(Directives);
  app.use(store);
  app.use(router);
  // 路由守卫
  await setupI18n(app);
  app.mount('#app');

  // 第三方插件注册
  plugins.install(app);
}

bootstrap();
