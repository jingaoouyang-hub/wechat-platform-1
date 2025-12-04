<template>
  <a-modal v-model:visible="visible" title="上传素材" :width="680" @ok="handleOk" @cancel="handleCancel">
    <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" :labelCol="{ style: { width: '100px' } }">
      <a-form-item label="类型" name="type" required>
        <a-select v-model:value="formState.type" :options="TypeList" placeholder="请选择类型" />
      </a-form-item>
      <a-form-item label="素材类型" name="materialType" required>
        <a-input v-model:value="formState.materialType" placeholder="请输入素材类型" />
      </a-form-item>
      <a-form-item class="file-item" label="上传素材" name="fileList" required>
        <a-upload
          class="avatar-uploader"
          name="avatar"
          accept="image/*"
          :show-upload-list="false"
          :custom-request="customRequest"
          :multiple="true"
        >
          <div class="upload-text">
            <LoadingOutlined v-if="loading"></LoadingOutlined>
            <PlusOutlined v-else></PlusOutlined>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <template v-if="formState.fileList.length > 0">
          <div class="img-box" v-for="(file, key) in formState.fileList" :key="key">
            <img :src="file" alt="avatar" />
            <div class="delete-box">
              <DeleteOutlined class="close-icon" @click="delImage(key)" />
            </div>
          </div>
        </template>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { postMaterialAddByUpload } from '@/api/wechat-manage/material';
import { TypeList } from '@/views/constant';

const emit = defineEmits(['ok']);
const visible = ref(false);
const formRef = ref(null);
const loading = ref(false);
let fileRecord = [];
const formState = reactive({
  type: undefined,
  materialType: undefined,
  fileList: [],
});
const rules = ref({
  type: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'blur',
    },
  ],
  materialType: [
    {
      required: true,
      message: '请输入素材类型',
      trigger: 'blur',
    },
  ],
  fileList: [
    {
      required: true,
      message: '请上传素材',
      trigger: 'change',
      type: 'array',
    },
  ],
});

const handleOk = () => {
  formRef.value.validate().then(() => {
    const formData = new FormData();
    formData.append('type', formState.type);
    formData.append('materialType', formState.materialType);
    fileRecord.forEach(file => {
      formData.append('files', file);
    });
    postMaterialAddByUpload(formData).then(() => {
      visible.value = false;
      clearFormState();
      emit('ok');
    });
  });
};

const clearFormState = () => {
  Object.assign(formState, {
    fileList: [],
    type: undefined,
    materialType: undefined,
  });
  fileRecord = [];
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
  loading.value = true;
  let reader = new FileReader();
  reader.onload = function (readerEvent) {
    loading.value = false;
    formState.fileList.push(readerEvent.target.result);
    fileRecord.push(file);
    formRef.value.validateFields(['fileList']);
  };
  reader.readAsDataURL(file); // 读取文件内容为DataURL
};
const delImage = key => {
  formState.fileList.splice(key, 1);
  fileRecord.splice(key, 1);
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
