<template>
  <a-modal
    v-model:visible="visible"
    :title="isEdit ? '编辑按钮配置' : '添加按钮配置'"
    @ok="handleOk"
    @cancel="handleCancel"
    width="600px"
  >
    <a-form ref="formRef" :model="formSate" :rules="rules" layout="vertical">
      <a-form-item label="按钮名称" name="buttonName">
        <a-input v-model:value="formSate.buttonName" placeholder="请输入按钮名称" />
      </a-form-item>
      <a-form-item label="按钮文案" name="buttonCopywriting">
        <a-input v-model:value="formSate.buttonCopywriting" placeholder="请输入按钮文案" />
      </a-form-item>
      <a-form-item label="按钮图片" name="buttonImage">
        <a-upload
          class="avatar-uploader"
          name="avatar"
          accept="image/*"
          :show-upload-list="false"
          :custom-request="customRequest"
          :multiple="false"
        >
          <div class="upload-text" v-if="!formSate?.buttonImage">
            <LoadingOutlined v-if="loading"></LoadingOutlined>
            <PlusOutlined v-else></PlusOutlined>
            <div class="ant-upload-text">上传</div>
          </div>
          <img class="upload-text" v-else :src="formSate?.buttonImage" />
        </a-upload>
      </a-form-item>
      <a-form-item label="启用状态" name="enabled">
        <a-switch v-model:checked="formSate.enabled" :checked-children="'启用'" :un-checked-children="'禁用'" />
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

const formSate = reactive({
  buttonCopywriting: '',
  buttonImage: '',
  buttonName: '',
  enabled: true,
  id: 0,
});

const rules = {
  buttonName: [{ required: true, message: '请输入按钮名称', trigger: 'blur' }],
  buttonCopywriting: [{ required: true, message: '请输入按钮文案', trigger: 'blur' }],
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
    formSate.buttonImage = result.data.picUrl;
  });
};
const showModal = (record = {}, edit = false) => {
  isEdit.value = edit;
  if (edit && record.id) {
    Object.assign(formSate, record);
  } else {
    // 重置表单
    Object.assign(formSate, {
      buttonCopywriting: '',
      buttonImage: '',
      buttonName: '',
      enabled: true,
      id: 0,
    });
  }
  visible.value = true;
};

const handleOk = async () => {
  try {
    await formRef.value.validateFields();
    emit('ok', { ...formSate });
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
