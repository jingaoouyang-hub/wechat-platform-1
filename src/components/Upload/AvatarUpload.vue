<template>
  <a-upload
    class="avatar-uploader"
    name="avatar"
    accept="image/*"
    :show-upload-list="false"
    :custom-request="customRequest"
    :multiple="false"
  >
    <div class="upload-text" v-if="!imageUrl">
      <LoadingOutlined v-if="loading"></LoadingOutlined>
      <PlusOutlined v-else></PlusOutlined>
      <div class="ant-upload-text">上传</div>
    </div>
    <img class="upload-text" v-else :src="imageUrl" />
  </a-upload>
</template>

<script setup>
import { ref, watch } from 'vue';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { postFansPicUpload } from '@/api/wechat-manage/fans';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'success']);

const imageUrl = ref(props.modelValue);
const loading = ref(false);

watch(
  () => props.modelValue,
  val => {
    imageUrl.value = val;
  },
);

const customRequest = files => {
  const file = files.file;
  if (!file.type.match('image.*')) {
    console.log('请选择图片文件');
    return;
  }
  loading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  postFansPicUpload(formData)
    .then(result => {
      imageUrl.value = result.data.picUrl;
      emit('update:modelValue', result.data.picUrl);
      emit('success', result.data);
    })
    .catch(() => {
      loading.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style lang="less" scoped>
.avatar-uploader {
  display: inline-block;
  margin-right: 16px;
  margin-bottom: 16px;
  :deep(.ant-upload) {
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
</style>
