<template>
  <a-modal v-model:visible="visible" title="修改素材类型" :width="600" @ok="handleOk" @cancel="handleCancel">
    <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" :labelCol="{ style: { width: '100px' } }">
      <a-form-item label="类型" name="type" required>
        <a-select v-model:value="formState.type" :options="TypeList" placeholder="请选择类型" />
      </a-form-item>
      <a-form-item label="素材类型" name="materialType" required>
        <a-input v-model:value="formState.materialType" placeholder="请输入素材类型" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { TypeList } from '@/views/constant';

const emit = defineEmits(['ok']);
const visible = ref(false);
const formRef = ref(null);
const formState = reactive({
  type: undefined,
  materialType: undefined,
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
});

const handleOk = () => {
  formRef.value.validate().then(() => {
    visible.value = false;
    emit('ok',formState);
  });
};
const clearFormState = () => {
  Object.assign(formState, {
    type: undefined,
    materialType: undefined,
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

defineExpose({
  showModal,
  visible,
});
</script>
