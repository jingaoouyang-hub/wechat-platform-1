<template>
  <a-modal
    v-model:visible="visible"
    :title="isEdit ? '编辑图片配置' : '添加图片配置'"
    @ok="handleOk"
    @cancel="handleCancel"
    width="600px"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item label="图片名称" name="imageName">
        <a-input v-model:value="formState.imageName" placeholder="请输入图片名称" />
      </a-form-item>
      <a-form-item label="图片描述" name="imageDescription">
        <a-textarea v-model:value="formState.imageDescription" placeholder="请输入图片描述" :rows="3" />
      </a-form-item>
      <a-form-item label="排序序号" name="sortOrder">
        <a-input-number v-model:value="formState.sortOrder" :min="0" placeholder="请输入排序序号" style="width: 100%" />
      </a-form-item>
      <a-form-item label="图片地址" name="imageUrl">
        <a-upload
          class="avatar-uploader"
          name="avatar"
          accept="image/*"
          :show-upload-list="false"
          :custom-request="customRequest"
          :multiple="false"
        >
          <div class="upload-text" v-if="!formState?.imageUrl">
            <LoadingOutlined v-if="loading"></LoadingOutlined>
            <PlusOutlined v-else></PlusOutlined>
            <div class="ant-upload-text">上传</div>
          </div>
          <img class="upload-text" v-else :src="formState?.imageUrl" />
        </a-upload>
      </a-form-item>
      <a-form-item label="启用状态" name="enabled">
        <a-switch v-model:checked="formState.enabled" :checked-children="'启用'" :un-checked-children="'禁用'" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { postFansPicUpload } from '@/api/wechat-manage/fans';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue', 'ok', 'cancel']);

const visible = ref(false);
const formRef = ref();
const isEdit = ref(false);
const loading = ref(false);

const formState = reactive({
  imageDescription: '',
  imageName: '',
  imageUrl: '',
  sortOrder: 0,
  enabled: true,
  id: 0,
});

const rules = {
  imageName: [{ required: true, message: '请输入图片名称', trigger: 'blur' }],
};

const customRequest = files => {
  const file = files.file;
  if (!file.type.match('image.*')) {
    console.log('请选择图片文件');
    return;
  }
  loading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  postFansPicUpload(formData).then(result => {
    formState.imageUrl = result.data.picUrl;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
};

const showModal = (record = {}, edit = false) => {
  isEdit.value = edit;
  if (edit && record.id) {
    Object.assign(formState, record);
  } else {
    // 重置表单
    Object.assign(formState, {
      imageDescription: '',
      imageName: '',
      imageUrl: '',
      sortOrder: 0,
      enabled: true,
      id: 0,
    });
  }
  visible.value = true;
};

const handleOk = async () => {
  try {
    await formRef.value.validateFields();
    emit('ok', { ...formState });
    visible.value = false;
  } catch (error) {
    console.log('Validation failed:', error);
  }
};

const handleCancel = () => {
  visible.value = false;
  emit('cancel');
};

// 暴露方法给父组件调用
defineExpose({
  showModal,
});
</script>

<style scoped lang="less">
.avatar-uploader {
  display: inline-block;
  margin-right: 16px;
  margin-bottom: 16px;
  :deep {
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
}
</style>