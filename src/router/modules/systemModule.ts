export default [
  {
    path: '/sys',
    name: 'sys-manage',
    meta: {
      title: '系统管理',
      icon: 'SettingOutlined',
    },
    redirect: '/power-manage/user-manage',
    component: () => import('@/components/Layout/CommonLayout.vue'),
    children: [
      {
        path: '/power-manage/user-manage',
        name: 'user-manage',
        meta: {
          title: '用户管理',
          keepAlive: true,
        },
        hideChildrenInMenu: true,
        redirect: '/user-manage-list',
        component: () => import('@/components/Layout/CommonLayout.vue'),
        children: [
          {
            path: '/user-manage-list',
            name: 'user-manage-list',
            permission: ['page'],
            meta: {
              title: '用户管理列表',
              keepAlive: true,
            },
            component: () => import('@/views/system/power-manage/user-manage/index.vue'),
          },
        ],
      },
      // {
      //   path: '/power-manage/department-manage',
      //   name: 'department-manage',
      //   meta: {
      //     title: '组织管理',
      //     keepAlive: true,
      //   },
      //   component: () => import('@/views/system/power-manage/department-manage/index.vue'),
      // },
      {
        path: '/power-manage/role-manage',
        name: 'role-manage',

        meta: {
          title: '角色管理',
          keepAlive: true,
        },
        hideChildrenInMenu: true,
        redirect: '/role-manage-list',
        component: () => import('@/components/Layout/CommonLayout.vue'),
        children: [
          {
            permission: ['page'],
            path: '/role-manage-list',
            name: 'role-manage-list',

            meta: {
              title: '角色管理列表',
              keepAlive: true,
            },
            component: () => import('@/views/system/power-manage/role-manage/index.vue'),
          },
        ],
      },
      {
        path: '/menu-manage',
        name: 'menu-manage',
        meta: {
          title: '菜单管理',
          keepAlive: true,
        },
        component: () => import('@/views/system/menu-manage/index.vue'),
      },
      {
        path: '/sys-config',
        name: 'sys-config',
        meta: {
          title: '系统配置',
          keepAlive: true,
        },
        component: () => import('@/views/system/sys-config/index.vue'),
      },
      {
        path: '/flow-manage/home',
        name: 'flow-manage-home',
        hideChildrenInMenu: true,
        meta: {
          title: '流程设计',
          keepAlive: true,
        },
        redirect: '/flow-manage/home/list',
        component: () => import('@/components/Layout/CommonLayout.vue'),
        children: [
          {
            path: '/flow-manage/home/list',
            name: 'flow-manage-home-list',
            meta: {
              title: '流程设计列表',
              keepAlive: true,
            },
            component: () => import('@/views/flow-manage/home/index.vue'),
          },
          {
            path: '/flow-manage/home/detail',
            name: 'flow-manage-home-detail',
            hidden: true,
            meta: {
              title: '流程设计详情',
              keepAlive: true,
              isShowBreadCrumb: true,
            },
            component: () => import('@/views/flow-manage/home/detail/index.vue'),
          },
        ],
      },
      {
        path: '/log-manage',
        name: 'log-manage',
        meta: {
          title: '日志管理',
          keepAlive: true,
        },
        component: () => import('@/views/system/log-manage/index.vue'),
        // component: () => import('@/components/Layout/CommonLayout.vue'),
        // children: [
        //   {
        //     path: '/log-manage/operation-log',
        //     name: 'operation-log',
        //     meta: {
        //       title: '操作日志',
        //     },
        //     component: () => import('@/views/system/log-manage/operation-log.vue'),
        //   },
        //   {
        //     path: '/log-manage/login-log',
        //     name: 'login-log',
        //     meta: {
        //       title: '登录日志',
        //     },
        //     component: () => import('@/views/system/log-manage/login-log.vue'),
        //   },
        //   {
        //     path: '/log-manage/error-log',
        //     name: 'error-log',
        //     meta: {
        //       title: '错误日志',
        //     },
        //     component: () => import('@/views/system/log-manage/error-log.vue'),
        //   },
        // ],
      },
      {
        path: '/data-dictionary',
        name: 'data-dictionary',
        meta: {
          title: '数据字典',
          keepAlive: true,
        },
        hideChildrenInMenu: true,
        redirect: '/data-dictionary-list',
        component: () => import('@/components/Layout/CommonLayout.vue'),
        children: [
          {
            path: '/data-dictionary-list',
            name: 'data-dictionary-list',
            permission: ['page'],
            meta: {
              title: '数据字典',
              keepAlive: true,
            },
            component: () => import('@/views/system/data-dictionary/index.vue'),
          },
        ],
      },

      // {
      //   path: '/dictionary-manage',
      //   name: 'dictionary-manage',
      //   meta: {
      //     title: '字典管理',
      //     noJump: true,
      //   },
      //   component: () => import('@/components/Layout/CommonLayout.vue'),
      //   children: [
      //     {
      //       path: '/dictionary-manage/dictionary-list',
      //       name: 'dictionary-list',
      //       meta: {
      //         title: '字典列表',
      //         noJump: true,
      //       },
      //       component: () => import('@/views/system/dictionary-manage/dictionary-list/dictionary-list.vue'),
      //     },
      //     {
      //       path: '/dictionary-manage/dictionary-list-detail',
      //       name: 'dictionary-list-detail',
      //       meta: {
      //         title: '添加子类',
      //         toRoute: 'dictionary-list',
      //       },
      //       component: () => import('@/views/system/dictionary-manage/dictionary-list/dictionary-list-detail.vue'),
      //     },
      //   ],
      // },
    ],
  },
];
