<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.id ? '编辑公众号' : '添加公众号'"
    :width="600"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" :labelCol="{ style: { width: '100px' } }">
      <a-form-item label="公众号名称" name="officialName" required>
        <a-input v-model:value="formState.officialName" placeholder="请输入公众号名称" />
      </a-form-item>
      <a-form-item label="appId" name="appId" required>
        <a-input v-model:value="formState.appId" placeholder="请输入appId" />
      </a-form-item>
      <a-form-item label="appSecret" name="appSecret" required>
        <a-input v-model:value="formState.appSecret" placeholder="请输入appSecret" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { postAccountAdd, postAccountUpdate } from '@/api/wechat-manage/index';
import { message } from 'ant-design-vue';

const emit = defineEmits(['ok']);
const visible = ref(false);
const formRef = ref(null);
const formState = reactive({
  appId: undefined,
  appSecret: undefined,
  createdUserId: undefined,
  gmtCreate: undefined,
  id: undefined,
  officialName: undefined,
});
const rules = ref({
  officialName: [
    {
      required: true,
      message: '请输入公众号名称',
      trigger: 'blur',
    },
  ],
  appId: [
    {
      required: true,
      message: '请输入appId',
      trigger: 'blur',
    },
  ],
  appSecret: [
    {
      required: true,
      message: '请输入appSecret',
    },
  ],
});
const handleOk = () => {
  formRef.value.validate().then(() => {
    if (formState.id) {
      postAccountUpdate(formState).then(() => {
        visible.value = false;
        message.success('修改成功');
        emit('ok');
      });
    } else {
      postAccountAdd(formState).then(() => {
        visible.value = false;
        message.success('添加成功');
        emit('ok');
      });
    }
  });
};
const clearFormState = () => {
  Object.assign(formState, {
    appId: undefined,
    appSecret: undefined,
    createdUserId: undefined,
    gmtCreate: undefined,
    id: undefined,
    officialName: undefined,
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
