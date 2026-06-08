<template>
  <a-modal v-model:visible="visible" title="发布爆款" :width="600" @ok="handleOk" @cancel="handleCancel">
    <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" :labelCol="{ style: { width: '150px' } }">
      <a-form-item label="公众号列表" name="accountIds" required>
        <a-select
          v-model:value="formState.accountIds"
          mode="multiple"
          placeholder="请选择模板类型"
          showSearch
          :filter-option="filterOption"
          :options="accountList"
        />
      </a-form-item>
      <a-form-item label="是否携带名片选项" name="accountCard" required>
        <a-radio-group v-model:value="formState.accountCard" name="radioGroup">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="是否禁止放大" name="isForbidZoom" required>
        <a-radio-group v-model:value="formState.isForbidZoom" name="radioGroup">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="文章链接" name="links" required>
        <a-textarea v-model:value="linkText" placeholder="每个链接后面用回车分隔" @change="changeLinkText"></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { postPublishHot, postWechatAccount } from '@/api/wechat-manage/index';
import { message } from 'ant-design-vue';

const emit = defineEmits(['ok']);
const visible = ref(false);
const formRef = ref(null);
const accountList = ref([]);
const linkText = ref('');
const route = useRoute();
const formState = reactive({
  accountCard: false,
  accountIds: undefined,
  links: undefined,
  isForbidZoom: false,
});
const rules = ref({
  accountIds: [
    {
      required: true,
      message: '请选择公众号',
      trigger: 'blur',
      type: 'array',
    },
  ],
  accountCard: [
    {
      required: true,
      message: '请选择是否携带名片选项',
      trigger: 'blur',
      type: 'boolean',
    },
  ],
});

onMounted(() => {
  postWechatAccount().then(res => {
    accountList.value = res.data.map(t => {
      return {
        label: t.officialName,
        value: t.id,
        ...t,
      };
    });
  });
});

const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const handleOk = () => {
  formRef.value.validate().then(() => {
    postPublishHot(formState).then(() => {
      visible.value = false;
      message.success('发布成功');
      clearFormState();
      emit('ok');
    });
  });
};
const clearFormState = () => {
  linkText.value = undefined;
  Object.assign(formState, {
    accountCard: false,
    accountIds: undefined,
    links: undefined,
    isForbidZoom: false,
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

const changeLinkText = () => {
  formState.links = linkText.value.split('\n');
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
