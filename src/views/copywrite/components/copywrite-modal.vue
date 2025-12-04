<template>
  <a-modal v-model:visible="visible" title="添加文案" :width="600" @ok="handleOk" @cancel="handleCancel">
    <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" :labelCol="{ style: { width: '100px' } }">
      <a-form-item label="文案类型" name="type" required>
        <a-select v-model:value="formState.type" :options="CopywriteType" placeholder="请选择文案类型"></a-select>
      </a-form-item>
      <a-form-item label="文案" name="copywriter" required>
        <a-textarea
          v-model:value="formState.copywriter"
          placeholder="请输入文案"
          :autoSize="{ minRows: 4, maxRows: 6 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { postAddCopywrite, postUpdateCopywrite } from '@/api/wechat-manage/title';
import { message } from 'ant-design-vue';
import { CopywriteType } from '@/views/constant';
const emit = defineEmits(['ok']);
const visible = ref(false);
const formRef = ref(null);
const formState = reactive({
  copywriter: undefined,
  type: undefined,
  id: undefined,
});
const rules = ref({
  copywriter: [
    {
      required: true,
      message: '请输入文案',
      trigger: 'blur',
    },
  ],
  type: [
    {
      required: true,
      message: '请选择文案类型',
      trigger: 'blur',
    },
  ],
});

const handleOk = () => {
  formRef.value.validate().then(() => {
    let postApi = formState.id ? postUpdateCopywrite : postAddCopywrite;
    postApi(formState).then(() => {
      visible.value = false;
      message.success(formState.id ? '修改成功' : '添加成功');
      emit('ok');
    });
  });
};
const clearFormState = () => {
  Object.assign(formState, {
    copywriter: undefined,
    type: undefined,
    id: undefined,
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
