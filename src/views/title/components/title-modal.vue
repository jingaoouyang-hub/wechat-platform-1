<template>
  <a-modal v-model:visible="visible" title="添加标题" :width="600" @ok="handleOk" @cancel="handleCancel">
    <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" :labelCol="{ style: { width: '100px' } }">
      <a-form-item label="标题" name="title" required>
        <a-input v-model:value="formState.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item label="类型" name="type" required>
        <a-select v-model:value="formState.type" :options="TypeList" placeholder="请选择类型" />
      </a-form-item>
      <a-form-item label="标题类型" name="titleType" required>
        <a-input v-model:value="formState.titleType" placeholder="请输入标题类型" />
      </a-form-item>
      <a-form-item label="公众号" name="accountId">
        <a-select
          v-model:value="formState.accountId"
          optionFilterProp="label"
          showSearch
          :options="accountList"
          placeholder="请选择公众号"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { postTitleAdd } from '@/api/wechat-manage/title';
import { postAcountList } from '@/api/wechat-manage/index';
import { message } from 'ant-design-vue';
import { TypeList } from '@/views/constant';

const emit = defineEmits(['ok']);
const visible = ref(false);
const formRef = ref(null);
const formState = reactive({
  title: undefined,
  type: undefined,
  accountId: undefined,
  titleType: undefined
});
const rules = ref({
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: 'blur',
    },
  ],
  type: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'blur',
    },
  ],
  titleType: [
    {
      required: true,
      message: '请输入标题类型',
      trigger: 'blur',
    },
  ],
});

const accountList = ref([]);

onMounted(() => {
  postAcountList().then(result => {
    accountList.value = result.data.map(t => {
      return {
        label: t.officialName,
        value: t.id,
      };
    });
  });
});

const handleOk = () => {
  formRef.value.validate().then(() => {
    postTitleAdd(formState).then(() => {
      visible.value = false;
      message.success('添加成功');
      emit('ok');
    });
  });
};
const clearFormState = () => {
  Object.assign(formState, {
    title: undefined,
    type: undefined,
    accountId: undefined,
    titleType: undefined
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
