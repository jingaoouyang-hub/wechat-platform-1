<template>
  <a-modal v-model:visible="visible" title="添加素材" :width="600" @ok="handleOk" @cancel="handleCancel">
    <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" :labelCol="{ style: { width: '100px' } }">
      <a-form-item label="合成类型" name="generateType" required>
        <a-select v-model:value="formState.generateType" :options="generateType" placeholder="请选择合成类型" />
      </a-form-item>
      <a-form-item label="背景颜色" name="backgroundColor" required>
        <input type="color" v-model="formState.backgroundColor" placeholder="请选择背景颜色" />
      </a-form-item>
      <a-form-item label="是否需要原图" name="isOd">
        <a-radio-group v-model:value="formState.isOd">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { postMaterialGenerateSelected, postMaterialGenerateType } from '@/api/wechat-manage/material';

const emit = defineEmits(['ok']);
const visible = ref(false);
const formRef = ref(null);
const formState = reactive({
  backgroundColor: '#ffffff',
  generateType: undefined,
  picUrls: [],
  isOd: true,
});
const rules = ref({});
const generateType = ref([]);
onMounted(() => {
  postMaterialGenerateType().then(res => {
    generateType.value = res.data.map(t => {
      return {
        label: t.name,
        value: t.code,
      };
    });
  });
});

const handleOk = () => {
  formRef.value.validate().then(() => {
    postMaterialGenerateSelected(formState).then(() => {
      visible.value = false;
      emit('ok');
    });
  });
};
const clearFormState = () => {
  Object.assign(formState, {
    backgroundColor: '#ffffff',
    generateType: undefined,
    picUrls: [],
    isOd: true,
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
