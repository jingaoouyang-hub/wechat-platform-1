export default [
  {
    path: '/wechat/index',
    name: 'wechat-manage',
    meta: {
      title: '公众号管理',
      keepAlive: true,
    },
    component: () => import('@/views/wechat/index.vue'),
  },
  {
    path: '/wechat/template-manage',
    name: 'wechat-template-manage',
    meta: {
      title: '模板管理',
      keepAlive: true,
      toRoute: 'wechat-manage',
    },
    hidden: true,
    component: () => import('@/views/wechat/template.vue'),
  },
  {
    path: '/template-manage/page',
    name: 'template-manage-page',
    meta: {
      title: '模板管理',
      keepAlive: true,
    },
    component: () => import('@/views/template/index.vue'),
  },
  {
    path: '/wechat/publish-record',
    name: 'wechat-publish-record',
    meta: {
      title: '发布记录',
      keepAlive: true,
      toRoute: 'wechat-manage',
    },
    hidden: true,
    component: () => import('@/views/wechat/record.vue'),
  },
  {
    path: '/material/index',
    name: 'material-manage',
    meta: {
      title: '素材管理',
      keepAlive: true,
    },
    component: () => import('@/views/material/index.vue'),
  },
  {
    path: '/title/index',
    name: 'title-manage',
    meta: {
      title: '标题管理',
      keepAlive: true,
    },
    component: () => import('@/views/title/index.vue'),
  },

  {
    path: '/copywrite/index',
    name: 'copywrite-manage',
    meta: {
      title: '文案管理',
      keepAlive: true,
    },
    component: () => import('@/views/copywrite/index.vue'),
  },
  {
    path: '/fans/index',
    name: 'fans-manage',
    meta: {
      title: '微信接粉二维码管理',
      keepAlive: true,
    },
    component: () => import('@/views/fans/index.vue'),
  },
  {
    path: '/window/index',
    name: 'window-manage',
    meta: {
      title: '微信弹窗二维码管理',
      keepAlive: true,
    },
    component: () => import('@/views/wechat-open-manage/index.vue'),
  },
  {
    path: '/user/index',
    name: 'user-manage',
    meta: {
      title: '用户管理',
      keepAlive: true,
    },
    component: () => import('@/views/user-manage/index.vue'),
  },
  {
    path: '/applet-manage',
    name: 'applet-manage',
    meta: {
      title: '小程序管理',
      keepAlive: true,
    },
    component: () => import('@/components/Layout/CommonLayout.vue'),
    children: [
      {
        path: '/applet-manage/button',
        name: 'applet-manage-button',
        meta: {
          title: '小程序按钮配置',
          keepAlive: true,
        },
        component: () => import('@/views/applet-manage/applet-button.vue'),
      },
       {
        path: '/applet-manage/image',
        name: 'applet-manage-image',
        meta: {
          title: '小程序图片',
          keepAlive: true,
        },
        component: () => import('@/views/applet-manage/applet-image.vue'),
      },
    ]
  },
];
