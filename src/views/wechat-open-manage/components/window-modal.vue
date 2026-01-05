<template>
  <a-modal v-model:visible="visible" title="添加接粉图片" :width="680" @ok="handleOk" @cancel="handleCancel">
    <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" :labelCol="{ style: { width: '200px' } }">
      <a-form-item label="图片名称" name="name" required>
        <a-input v-model:value="formState.name" placeholder="请输入图片名称" />
      </a-form-item>

      <a-form-item class="file-item" label="上传弹窗二维码图片" name="picUrl" required>
        <a-upload
          class="avatar-uploader"
          name="avatar"
          accept="image/*"
          :show-upload-list="false"
          :custom-request="customRequest"
          :multiple="false"
        >
          <div class="upload-text" v-if="!formState.picUrl">
            <LoadingOutlined v-if="loading"></LoadingOutlined>
            <PlusOutlined v-else></PlusOutlined>
            <div class="ant-upload-text">上传</div>
          </div>
          <img class="upload-text" v-else :src="formState.picUrl" />
        </a-upload>
      </a-form-item>
      <a-form-item label="文字描述">
        <a-textarea v-model:value="formState.text" placeholder="请输入文字描述"></a-textarea>
      </a-form-item>
      <a-form-item label="启用状态" name="enable" required>
        <a-switch :checked="formState.enable === 1" @change="changeEnable"></a-switch>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { postFansPicUpload } from '@/api/wechat-manage/fans';
import { postWindowFansAdd, postWindowFansUpdate } from '@/api/wechat-manage/window';

const emit = defineEmits(['ok']);
const visible = ref(false);
const formRef = ref(null);
const loading = ref(false);

const formState = reactive({
  name: undefined,
  picUrl: undefined,
  enable: 0,
  text: undefined,
});
const rules = ref({
  name: [
    {
      required: true,
      message: '请输入图片名称',
      trigger: 'blur',
    },
  ],
  picUrl: [
    {
      required: true,
      message: '请上传弹窗二维码图片',
      trigger: 'change',
    },
  ],
});

const handleOk = () => {
  formRef.value.validate().then(() => {
    let postApi = formState.id ? postWindowFansUpdate : postWindowFansAdd;
    postApi(formState).then(result => {
      visible.value = false;
      clearFormState();
      emit('ok');
    });
  });
};


const clearFormState = () => {
  Object.assign(formState, {
    name: undefined,
    picUrl: undefined,
    enable: 0,
    text: undefined,
    id: undefined
  });
};

const showModal = data => {
  visible.value = true;
  if (data) {
    Object.assign(formState, data);
  } else {
    clearFormState();
  }
};

const handleCancel = () => {
  visible.value = false;
  clearFormState();
};

const customRequest = files => {
  const file = files.file;
  if (!file.type.match('image.*')) {
    console.log('请选择图片文件');
    return;
  }
  const formData = new FormData();
  formData.append('file', file);
  postFansPicUpload(formData).then(result => {
    formState.picUrl = result.data.picUrl;
    formRef.value.validateFields(['picUrl']);
  });
};

const changeEnable = () => {
  formState.enable = formState.enable ? 0 : 1;
};

defineExpose({
  showModal,
  visible,
});
</script>

<style lang="less">
.avatar-uploader {
  display: inline-block;
  margin-right: 16px;
  margin-bottom: 16px;
  .ant-upload {
    width: 128px;
    height: 128px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #ddd;
    border-radius: 4px;
    .upload-text {
      width: 128px;
      height: 128px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
    }

    &:hover {
      border: 1px dashed @primary-color;
    }
  }
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.file-item {
  .ant-form-item-control-input-content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
}
.img-box {
  display: inline-block;
  margin-right: 16px;
  margin-bottom: 16px;
  position: relative;
  img {
    display: inline-block;
    object-fit: cover;
    width: 128px;
    height: 128px;
  }
  .delete-box {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .close-icon {
    font-size: 18px;

    color: #fff;
    &:hover {
      color: #ff2222;
    }
  }
}
</style>
