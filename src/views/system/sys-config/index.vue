<!--  -->
<template>
  <PageLayout>
    <a-card style="height: 100%">
      <div>
        <div class="flex-between">
          <div class="font-weight-7 font-16 text-main">系统信息</div>
          <a-button type="primary" @click="editSysInfo">修改</a-button>
        </div>
        <div class="form-item flex-start">
          <div class="form-label text-045">平台名称</div>
          <div class="form-value">{{ formState.name || '--' }}</div>
          <div class="form-action"></div>
        </div>
        <div class="form-item flex-start">
          <div class="form-label text-045">描述</div>
          <div class="form-value">{{ formState.description || '--' }}</div>
          <div class="form-action"></div>
        </div>
        <!-- <div class="form-item flex-start">
          <div class="form-label text-045">文字颜色</div>
          <div class="form-value">
            <a-input type="color" style="width: 50px" v-model:value="formState.loginPageFontColour" disabled />
          </div>
          <div class="form-action"></div>
        </div> -->
      </div>
      <div class="pt-32">
        <div class="font-weight-7 font-16 text-main">个性化配置</div>
        <!-- <div class="form-item flex-start">
          <div class="form-label text-045">系统LOGO</div>
          <div class="form-value d-flex">
            <a-image :src="formState.logoUrl" :width="52" :fallback="loadError" placeholder :height="52"></a-image>
            <div class="ml-24">
              <div>建议尺寸52×52px</div>
              <div class="text-045">支持支持bmp，jpg，jpeg，png，tif格式，不超过5M。</div>
            </div>
          </div>
          <div class="form-action">
            <a-space>
              <a-button type="ghost" v-show="formState.logoUrl" @click="handleUpdateConfigLogo('')">恢复默认</a-button>
              <a-upload :fileList="[]" accept="image/*" :beforeUpload="e => uploadBeforeHandler(e, 'logo')">
                <a-button type="ghost">上传</a-button>
              </a-upload>
            </a-space>
          </div>
        </div> -->
        <div class="form-item flex-start">
          <div class="form-label text-045">登录页展示图</div>
          <div class="form-value d-flex">
            <a-image
              placeholder
              :fallback="loadError"
              :src="formState.loginPageBackgroundUrl || defaultImg"
              :width="52"
              :height="80"
            ></a-image>
            <div class="ml-24">
              <div>建议尺寸580×900px</div>
              <div class="text-045">支持支持bmp，jpg，jpeg，png，tif格式，不超过10M。</div>
            </div>
          </div>
          <div class="form-action">
            <a-space>
              <a-button
                type="ghost"
                v-show="formState.loginPageBackgroundUrl"
                @click="handleUpdateConfigBackground('')"
              >
                恢复默认
              </a-button>
              <a-upload :fileList="[]" accept="image/*" :beforeUpload="e => uploadBeforeHandler(e, 'login')">
                <a-button type="ghost">上传</a-button>
              </a-upload>
            </a-space>
          </div>
        </div>
      </div>
    </a-card>
  </PageLayout>
  <Modalnfo ref="modalInfoRef" @saveHandle="editAppConfigInfo"></Modalnfo>
  <ModalCopper ref="modalCopperRef" @uploadSuccess="uploadSuccess"></ModalCopper>
</template>

<script setup>
import { message } from 'ant-design-vue';

import ModalCopper from './components/modal-copper.vue';
import Modalnfo from './components/modal-info.vue';
import defaultImg from '@/assets/images/login_bg_blue.png'

// api
import { updateConfigBackground, updateConfigLogo } from '@/api/system/sysConfigApi';

// 图片
import loadError from '@/assets/images/load-error.png';

// 仓库数据
import { useStoreApp } from '@/store';
const storeApp = useStoreApp();

const modalInfoRef = ref(null);
const modalCopperRef = ref(null);

const formState = computed(() => {
  return storeApp.appConfig;
});

// 修改系统信息
const editSysInfo = () => {
  modalInfoRef.value.showModal(formState.value);
};

// 修改系统信息
const editAppConfigInfo = params => {
  storeApp.saveAppConfig(params || {});
};

let curType = ref('');
// 上传登录logo
function uploadBeforeHandler(file, type) {
  let limitSize = type === 'logo' ? 5 : 10;
  let size = file.size / 1024 / 1024;

  if (size > limitSize) {
    message.error('上传图片大小限制' + limitSize + 'M以下');
    return false;
  }
  curType.value = type;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (e) {
    modalCopperRef.value.showModal({ src: e.target?.result ?? '', filename: file.name, type });
  };
  return false;
}

// 头像修改成功回调
const uploadSuccess = ({ data }) => {
  if (curType.value === 'logo') {
    handleUpdateConfigLogo(data.url);
  } else {
    handleUpdateConfigBackground(data.url);
  }
};

const handleUpdateConfigLogo = (url = '') => {
  updateConfigLogo({ logoUrl: url }).then(() => {
    formState.value = Object.assign(formState.value, { avatarUrl: url });
    storeApp.saveAppConfig({ logoUrl: url });
  });
};

const handleUpdateConfigBackground = (url = '') => {
  updateConfigBackground({ loginPageBackgroundUrl: url }).then(() => {
    formState.value = Object.assign(formState.value, { avatarUrl: url });
    storeApp.saveAppConfig({ loginPageBackgroundUrl: url });
  });
};
</script>
<style lang="less" scoped>
.form-item {
  padding: 32px 24px;
  border-bottom: 1px solid #eee;
  // & + .form-item {

  // }
  .form-label {
    width: 120px;
  }
  .form-value {
    flex: 1;
  }
}
.info-warp {
  width: 582px;
  margin: 100px auto;
}
</style>
