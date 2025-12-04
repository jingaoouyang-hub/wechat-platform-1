<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.id ? '修改模板' : '新增模板'"
    :width="900"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" :labelCol="{ style: { width: '100px' } }">
      <a-form-item label="模板名称" name="templateName" required>
        <a-input v-model:value="formState.templateName" placeholder="请输入模板名称..." />
      </a-form-item>
      <a-form-item label="标题前缀" name="titlePre" required>
        <a-input v-model:value="formState.titlePre" placeholder="请输入标题前缀..." />
      </a-form-item>
      <a-form-item label="模板类型" name="type" required>
        <a-select v-model:value="formState.type" placeholder="请选择模板类型" :options="TemplateType" />
      </a-form-item>
      <a-form-item label="模板内容" name="templateContent" required>
        <!-- <WangEditor
          ref="wangEditorRef"
          content-height="500px"
          border
          v-model:value="formState.templateContent"
          :editor-config="{ placeholder: '请输入模板内容...' }"
        /> -->
        <a-textarea
          v-model:value="formState.templateContent"
          placeholder="请输入模板内容..."
          :autosize="{ minRows: 6, maxRows: 10 }"
        ></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { postTemplateSave } from '@/api/wechat-manage/index';
import { TemplateType } from '@/views/constant';
import { message } from 'ant-design-vue';

const emit = defineEmits(['ok']);
const visible = ref(false);
const formRef = ref(null);
const route = useRoute();
// const wangEditorRef = ref(null);
const formState = reactive({
  titlePre: undefined,
  templateContent: undefined,
  id: undefined,
  templateName: undefined,
  accountId: undefined,
  type: undefined,
});
const rules = ref({
  templateName: [
    {
      required: true,
      message: '请输入模板名称',
      trigger: 'blur',
    },
  ],
  titlePre: [
    {
      required: true,
      message: '请输入标题前缀',
      trigger: 'blur',
    },
  ],
  templateContent: [
    {
      required: true,
      message: '请输入模板内容',
    },
  ],
});
const handleOk = () => {
  formRef.value.validate().then(() => {
    postTemplateSave({ ...formState, accountId: route.query.id }).then(() => {
      visible.value = false;
      message.success('保存成功');
      clearFormState();
      emit('ok');
    });
  });
};
const clearFormState = () => {
  Object.assign(formState, {
    titlePre: '',
    templateContent: '',
    id: undefined,
    templateName: '',
    accountId: undefined,
    type: undefined,
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
