<template>
  <a-modal
    :title="curInfo.title"
    width="900px"
    :canFullscreen="false"
    :visible="modalVisible"
    @ok="handleOk"
    @cancel="cancelHandle"
  >
    <div class="copperModal">
      <div :class="`copperModal-left`">
        <div :class="`copperModal-cropper`">
          <CropperImage
            v-if="src"
            :src="src"
            :options="{ aspectRatio: curInfo.aspectRatio }"
            height="300px"
            @cropend="handleCropend"
            @ready="handleReady"
          />
        </div>
        <div :class="`copperModal-toolbar`">
          <Space>
            <a-button type="primary" size="small" :disabled="!src" @click="handlerToolbar('reset')">
              <template #icon><ReloadOutlined /></template>
            </a-button>
            <a-button type="primary" size="small" :disabled="!src" @click="handlerToolbar('rotate', -45)">
              <template #icon><RotateLeftOutlined /></template>
            </a-button>
            <a-button type="primary" size="small" :disabled="!src" @click="handlerToolbar('rotate', 45)">
              <template #icon><RotateRightOutlined /></template>
            </a-button>
            <a-button type="primary" size="small" :disabled="!src" @click="handlerToolbar('scaleX')">
              <template #icon><SwapOutlined /></template>
            </a-button>
            <a-button type="primary" size="small" :disabled="!src" @click="handlerToolbar('scaleY')">
              <template #icon><VerticalAlignMiddleOutlined /></template>
            </a-button>
            <a-button type="primary" size="small" :disabled="!src" @click="handlerToolbar('zoom', 0.1)">
              <template #icon><ZoomInOutlined /></template>
            </a-button>
            <a-button type="primary" size="small" :disabled="!src" @click="handlerToolbar('zoom', -0.1)">
              <template #icon><ZoomOutOutlined /></template>
            </a-button>
          </Space>
        </div>
      </div>
      <div :class="`copperModal-right flex-col-center`">
        <div :class="`copperModal-preview ${copperType === 'login' && 'login'}`">
          <img :src="previewSource" v-if="previewSource" />
        </div>
        <div class="text-085 mt-12 font-16 text-center">预览</div>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import type { CropendResult, Cropper } from '@/components/Cropper/src/typing';
import { defineComponent, ref, computed } from 'vue';

import { dataURLtoBlob } from '@/utils/file/base64Conver';
import { isFunction } from '@/utils/is';
// api
import { uploadImage } from '@/api/common';

// 组件
import { CropperImage } from '@/components/Cropper';
import { Space } from 'ant-design-vue';
import {
  ReloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  VerticalAlignMiddleOutlined,
} from '@ant-design/icons-vue';
const props = {
  circled: { type: Boolean, default: true },
  uploadApi: {
    type: Function as any,
    default: uploadImage,
  },
};

export default defineComponent({
  name: 'CropperModal',
  components: {
    Space,
    CropperImage,
    ReloadOutlined,
    RotateRightOutlined,
    SwapOutlined,
    RotateLeftOutlined,
    VerticalAlignMiddleOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
  },
  props,
  emits: ['uploadSuccess', 'register'],
  setup(props, { emit }) {
    let filename = '';
    const src = ref('');
    const previewSource = ref('');
    const cropper = ref<Cropper>();
    let scaleX = 1;
    let scaleY = 1;

    // Block upload
    function handleBeforeUpload(file: File) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      src.value = '';
      previewSource.value = '';
      reader.onload = function (e) {
        src.value = (e.target?.result as string) ?? '';
        filename = file.name;
      };
      return false;
    }

    function handleCropend({ imgBase64 }: CropendResult) {
      previewSource.value = imgBase64;
    }

    function handleReady(cropperInstance: Cropper) {
      cropper.value = cropperInstance;
    }

    function handlerToolbar(event: string, arg?: number) {
      if (event === 'scaleX') {
        scaleX = arg = scaleX === -1 ? 1 : -1;
      }
      if (event === 'scaleY') {
        scaleY = arg = scaleY === -1 ? 1 : -1;
      }
      cropper?.value?.[event]?.(arg);
    }

    async function handleOk() {
      const uploadApi = props.uploadApi;
      if (uploadApi && isFunction(uploadApi)) {
        const blob = dataURLtoBlob(previewSource.value);
        let file = new File([blob], filename, { type: blob.type, lastModified: Date.now() });
        try {
          let formData = new FormData();
          formData.append('file', file);
          const result = await uploadApi(formData);
          emit('uploadSuccess', { source: previewSource.value, data: result.data });
        } finally {
        }
      }
      cancelHandle();
    }
    let modalVisible = ref(false);

    const copperType = ref();
    const copperObject = ref({
      logo: {
        aspectRatio: 1,
        title: '系统LOGO',
      },
      login: {
        aspectRatio: 0.6444,
        title: '登录页展示图',
      },
    });

    const curInfo = computed(() => {
      return copperObject.value[copperType.value] || {};
    });
    function showModal(info: any = {}) {
      previewSource.value = '';
      copperType.value = info.type || 'logo';
      src.value = info.src;
      filename = info.filename;
      modalVisible.value = true;
    }

    const cancelHandle = () => {
      src.value = '';
      modalVisible.value = false;
    };

    return {
      src,
      previewSource,
      copperType,
      curInfo,
      modalVisible,
      handleBeforeUpload,
      handleCropend,
      handleReady,
      handlerToolbar,
      handleOk,
      showModal,
      cancelHandle,
    };
  },
});
</script>

<style lang="less" scoped>
.copperModal {
  display: flex;

  &-left,
  &-right {
    height: 340px;
  }

  &-left {
    width: 55%;
  }

  &-right {
    width: 45%;
  }

  &-cropper {
    height: 300px;
    background: #eee;
    background-image: linear-gradient(45deg, rgb(0 0 0 / 25%) 25%, transparent 0, transparent 75%, rgb(0 0 0 / 25%) 0),
      linear-gradient(45deg, rgb(0 0 0 / 25%) 25%, transparent 0, transparent 75%, rgb(0 0 0 / 25%) 0);
    background-position: 0 0, 12px 12px;
    background-size: 24px 24px;
  }

  &-toolbar {
    display: flex;
    justify-content: end;
    align-items: center;
    margin-top: 10px;
  }

  &-preview {
    width: 220px;
    height: 220px;
    margin: 0 auto;
    overflow: hidden;
    border: 1px solid #eee;
    &.login {
      width: 174px;
      height: 270px;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  &-group {
    display: flex;
    padding-top: 8px;
    margin-top: 8px;
    border-top: 1px solid #eee;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
