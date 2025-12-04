<template>
  <a-modal
    destroy-on-close
    :mask-closable="false"
    :keyboard="false"
    :width="500"
    :visible="visible"
    :title="'修改系统信息'"
    @ok="saveHandle"
    @cancel="cancelHandle"
  >
    <a-form layout="vertical" :colon="false" ref="formRef" :model="formState" :rules="rules">
      <a-form-item label="名称" name="name" :rules="rules.name">
        <a-input v-model:value="formState.name" :maxlength="30" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea v-model:value="formState.description" show-count :maxlength="50" placeholder="请输入描述" />
      </a-form-item>
      <!-- <a-form-item label="文字颜色" name="loginPageFontColour">
        <a-input type="color" style="width: 50px" v-model:value="formState.loginPageFontColour" />
      </a-form-item> -->
    </a-form>
  </a-modal>
</template>

<script setup>
// api
import { updateConfigInfo } from '@/api/system/sysConfigApi';

const emits = defineEmits(['saveHandle']);

const visible = ref(false);

let formState = ref({
  name: '', // 名称
  description: '', // 描述
  loginPageFontColour: '#000000', // 描述
});

const cancelHandle = () => {
  formRef.value && formRef.value.resetFields();
  visible.value = false;
};

const rules = reactive({
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur',
    },
  ],
});
const formRef = ref();

const showModal = (record = {}) => {
  formState.value.name = record.name;
  formState.value.description = record.description;
  formState.value.loginPageFontColour = record.loginPageFontColour;
  visible.value = true;
};
const saveHandle = () => {
  formRef.value.validate().then(async () => {
    visible.value = false;
    updateConfigInfo(formState.value).then(() => {
      emits('saveHandle', formState.value);
    });
  });
};

defineExpose({ showModal });
</script>
