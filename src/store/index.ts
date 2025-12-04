// import type { App } from 'vue';
import { createPinia } from 'pinia';
import { useStoreUser } from './modules/user';
import { useStoreApp } from './modules/app';

export { useStoreUser, useStoreApp };

export function useStore() {
  return {
    user: useStoreUser(),
    app: useStoreApp(),
  };
}
const pinia = createPinia();
pinia.use(({ store }) => {
  const initialState = JSON.parse(JSON.stringify(store.$state));
  store.$reset = () => {
    store.$patch(initialState);
  };
});
export default function setupStore(app) {
  app.use(pinia);
}
