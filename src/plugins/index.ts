import type { App } from 'vue';

const files = import.meta.globEager('./*.ts');

const modules: any = {};

Object.keys(files).forEach((key: string) => {
  // icon特殊处理
  if (key === './icon.ts') {
    const filesCopy = files[key] as any;
    Object.keys(filesCopy).forEach(item => {
      filesCopy[item].install = (app: App) => {
        if (!(typeof app.component(filesCopy[item].displayName) === 'function')) {
          app.component(filesCopy[item].displayName, filesCopy[item]);
        }
      };
    });
  }
  modules[key?.replace(/(^\.\/|\.ts$)/g, '')] = files[key];
});

export default {
  install(app: App) {
    for (const file of Object.values(modules)) {
      for (const item of Object.entries(file as any)) {
        app.use(item[1] as any);
      }
    }
  },
};
