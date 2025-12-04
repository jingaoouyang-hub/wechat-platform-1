<template>
  <a-affix :offset-top="0" style="width: 100%">
    <a-layout-header class="layout-header">
      <div class="logo-box flex-center">
        <span v-show="!collapsed" class="name">公众号运营平台</span>
      </div>
      <BreadCrumb />
      <div class="flex-1"></div>

      <a-space :size="24">
        <div class="user-info">
          <!-- <MessageModule /> -->
          <a-popover trigger="hover" overlayClassName="header-user-info-popover" placement="bottomRight">
            <template #content>
              <div class="header-user-info-menu-item" @click="goPerson">
                <UserOutlined />
                个人信息
              </div>
              <div class="header-user-info-menu-item" @click="logout">
                <LogoutOutlined />
                退出登录
              </div>
            </template>
            <div class="user-info-text">
              <a-image :width="0" :height="0" :style="{ display: 'none' }" :src="userInfo?.avatarUrl || userIcon" />
              <img class="user-icon" :src="userInfo?.avatarUrl || userIcon" />

              <div class="user-name a-link">
                {{ userInfo?.realName }}
              </div>
            </div>
          </a-popover>
        </div>
      </a-space>
    </a-layout-header>
  </a-affix>
</template>
<script setup name="globalHeader">
import userIcon from '@/assets/images/default_head.png';
import BreadCrumb from './breadCrumb.vue';
// import MessageModule from './message.vue';
// 组件
import { Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

// 仓库数据
import { useStoreUser, useStoreApp } from '@/store';
import { ref } from 'vue';

const storeUser = useStoreUser();
const storeApp = useStoreApp();

const userInfo = computed(() => storeUser.userInfo);
const collapsed = computed(() => storeApp.collapsed);

const router = useRouter();
const isLogout = ref(false);

const goPerson = () => {
  router.push('/personal-set');
};

// 头像预览 end

// 退出登录
const logout = () => {
  if (isLogout.value) {
    return;
  }
  isLogout.value = true;
  Modal.confirm({
    title: '退出登录',
    icon: h(ExclamationCircleOutlined),
    content: '确认退出登录？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      storeUser.logout().then(() => {
        router.push('/login');
      });
    },
    onCancel() {
      isLogout.value = false;
    },
  });
};
</script>

<style scoped lang="less">
::v-deep(.ant-layout-header) {
  line-height: 1;
}

.layout-header {
  width: 100%;
  height: 60px;
  padding: 0 24px;
  background: rgba(20, 52, 109, 1);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  //border-bottom: 1px solid @border-color-base;

  .user-info {
    .user-info-text {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-shrink: 0;

      .user-icon {
        width: 26px;
        height: 26px;
        display: inline-block;
        margin-right: 6px;
      }

      .user-name {
        font-size: 16px;
        max-width: 130px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #fff;
      }
    }
  }

  .logo-box {
    height: 60px;
    // background: #ffffff;
    //background: #001529;
    //color: #fff;
    display: flex;
    justify-content: center;

    .logo {
      position: relative;
      height: 20px;

      margin-right: 8px;
    }
    .name {
      font-weight: bold;
      font-size: 16px;
      white-space: nowrap;
      color: #fff;
    }
  }
}

.header {
  border-bottom: 1px solid @border-color-base;
  background: #fff;

  .route-cache-box {
    background: #ffffff;
  }
}
</style>
