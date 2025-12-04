<template>
  <div class="login-box d-flex">
    <div class="left-box">
      <div
        class="image-box"
        :style="{ backgroundImage: `url(${appConfig.loginPageBackgroundUrl || defaultImg})` }"
      ></div>
    </div>

    <div class="right-box flex-1 flex-center">
      <div class="login-form">
        <div class="name mb-33" :style="{ color: appConfig.loginPageFontColour }">公众号运营平台</div>

        <a-form ref="form" :model="formState" :rules="rules" class="form-box p-32">
          <div class="form-title">账号登录</div>
          <a-form-item name="userName">
            <a-input v-model:value="formState.userName" placeholder="请输入账号" autocomplete="off">
              <template #prefix>
                <UserOutlined class="icon-color" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input-password
              v-model:value="formState.password"
              placeholder="请输入登录密码"
              type="password"
              autocomplete="off"
            >
              <template #prefix>
                <LockOutlined class="icon-color" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <a-button size="large" class="login-btn" type="primary" html-type="submit" @click="login">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
  <!-- captchaType： 1、blockPuzzle 2、clickWord -->
  <Verify
    @success="handleSuccess"
    mode="pop"
    :captchaType="'blockPuzzle'"
    :imgSize="{ width: '400px', height: '200px' }"
    ref="verifyRef"
  ></Verify>
</template>

<script setup name="login">
// 组件
import Verify from '@/components/Verifition/Verify.vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
// api
import { postRsaKey } from '@/api/userCenter';
// 方法
import { message } from 'ant-design-vue';
import { doEncrypt } from '@/utils/common';
import { setStore } from '@/utils/stroge';

import ruleMap from '@/setting/rules';

// 仓库数据
import { useStoreUser, useStoreApp } from '@/store';
import { SAVE_RSA_KEY } from '@/store/mutation-types';

import defaultImg from '@/assets/images/login_bg_blue.png';

const storeApp = useStoreApp();
const storeUser = useStoreUser();

const router = useRouter();
const form = ref(null);

const verifyRef = ref();
const formState = reactive({
  userName: '',
  password: '',
  captchaVerification: '',
  rememberMe: false,
});
const rules = {
  userName: [
    { required: true, message: '请输入手机号码' },
    { pattern: ruleMap.noEmoji.pattern, message: '用户账号不能输入特殊字符' },
  ],
  password: [{ required: true, message: '请输入登录密码' }],
};

const appConfig = computed(() => {
  return storeApp.appConfig;
});

const login = () => {
  handleFinish();
};

const handleSuccess = res => {
  formState.captchaVerification = res.captchaVerification;
  handleFinish(true);
};

const handleFinish = (captchaFlag = false) => {
  form.value.validate().then(async () => {
    postRsaKey().then(result => {
      let PUBLIC_KEY = result.data;
      setStore(SAVE_RSA_KEY, PUBLIC_KEY);
      storeUser
        .userLogin({
          userName: formState.userName,
          password: doEncrypt(formState.password, PUBLIC_KEY),
          captchaVerification: captchaFlag ? formState.captchaVerification : undefined,
          rememberMe: formState.rememberMe,
        })
        .then(() => {
          message.success('登录成功');
          storeUser.getUserInfo();
          router.push('/wechat/index');
        });
    });
  });
};
</script>

<style scoped lang="less">
.login-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .left-box {
    position: relative;
    min-width: 600px;
  }
  .right-box {
    position: relative;
  }

  .image-box {
    width: 600px;
    height: 100%;
    background-color: #ffffff;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }

  .content-box {
    position: absolute;
    right: 0;
    top: 0;
    width: 60%;
    height: 100%;
    background-color: #ffffff;

    &.content-box-full-screen {
      width: 0%;
    }
  }

  .logo {
    position: absolute;
    left: 39px;
    top: 39px;
    width: 261px;
    display: inline-block;
    margin-right: 16px;
    object-fit: scale-down;
  }
  .login-form {
    width: 480px;
    background: #ffffff;
    overflow: hidden;
    border-radius: 8px;
    .form-box {
      border: 1px solid #e9e9e9;
    }
    .name {
      text-align: center;
      font-size: 32px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }

    :deep(.ant-form) {
      border-radius: 8px;
      padding-bottom: 16px;
      .form-title {
        font-size: 26px;
        font-weight: 500;
        color: @heading-color;
        line-height: 40px;
        text-align: center;
        margin-bottom: 32px;
      }

      .ant-input-affix-wrapper {
        // background: #fff;
        border-radius: 2px;
        padding: 4px 18px;
        border: 1px solid #e6e6e8;
        height: 48px;
      }
      .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
        border-color: #1b90fb;
        border-right-width: 1px !important;
        z-index: 1;
      }
      .ant-input-affix-wrapper:focus,
      .ant-input-affix-wrapper-focused {
        border-color: #1b90fb;
        box-shadow: none;
      }
      .ant-input-prefix {
        margin-right: 18px;
      }

      .ant-input-suffix {
        margin-right: 5px;
      }

      .ant-form-item {
        margin-bottom: 32px;
      }

      .ant-form-item-with-help {
        margin-bottom: 0;
      }

      .ant-form-item-explain {
        min-height: 32px;
      }
      .ant-btn-primary {
        box-shadow: none;
        text-shadow: none;
      }

      .ant-input {
        line-height: 32px;
        // width: 284px;
        height: 38px;
        border-radius: 2px;
        font-size: 16px;
        border: 0;
        cursor: pointer;
      }

      .forget-psw {
        position: relative;
        top: -6px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        margin-bottom: 26px;
      }

      //登录按钮
      .login-btn {
        width: 100%;
        height: 48px;
      }
    }
  }
}

@media (max-width: 1360px) {
  .login-box {
    .image-box {
      width: 100%;
    }
    .content-box,
    .site-name-box,
    .logo-box {
      display: none;
    }

    .login-form {
      left: 50%;
      width: 90%;
      max-width: 480px;
    }
  }
}
:deep(input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill) {
  -webkit-text-fill-color: #000 !important;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
}
</style>
