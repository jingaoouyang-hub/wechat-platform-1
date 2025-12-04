/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import menuRoute from './menuRoute';
import { useStoreUser } from '@/store';
import { message } from 'ant-design-vue';

export const WHITE_NAME_LIST = ['login']; // no redirect WHITE_NAME_LIST

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/login/index.vue'),
  },
  {
    path: '/',
    meta: {
      title: '首页',
    },
    name: 'index',
    redirect: '/wechat/index',
    component: () => import(/* webpackChunkName: "about" */ '../views/index.vue'),
    children: [
      {
        path: '/personal-set',
        name: 'personal-set',
        meta: {
          title: '个人中心',
          icon: 'BarsOutlined',
        },
        redirect: '/personal-set/personal-msg',
        component: () => import(/* webpackChunkName: "about" */ '@/components/Layout/CommonLayout.vue'),
        children: [
          {
            path: '/personal-set/personal-msg',
            name: 'personal-msg',
            meta: {
              title: '个人信息',
            },
            component: () => import(/* webpackChunkName: "about" */ '@/views/personal/basic-info.vue'),
          },
        ],
      },
      ...menuRoute,
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    const store = useStoreUser();
    if (to.path === '/user/index') {
      if (store.userInfo.userName !== 'admin') {
        message.error('无权限');
        next(from.path);
        return;
      }
    }
    if (store.token) {
      next();
    } else {
      next('/login');
    }
  }
});

export default router;
