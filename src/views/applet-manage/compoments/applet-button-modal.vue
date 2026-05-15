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
        <AvatarUpload v-model:model-value="formSate.buttonImage" @success="() => formRef?.value?.validateFields(['buttonImage'])"/>
      </a-form-item>
      <a-form-item label="启用状态" name="enabled">
        <a-switch v-model:checked="formSate.enabled" :checked-children="'启用'" :un-checked-children="'禁用'" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, reactive } from 'vue';
import AvatarUpload from '@/components/Upload/AvatarUpload.vue';

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
</style>
