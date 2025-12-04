<template>
  <a-modal
    destroy-on-close
    :mask-closable="false"
    :keyboard="false"
    :width="500"
    :visible="visible"
    :title="'编辑姓名'"
    @ok="saveHandle"
    @cancel="cancelHandle"
  >
    <a-form layout="vertical" :colon="false" ref="formRef" :model="formState" :rules="rules">
      <a-form-item label="姓名" name="realName" :rules="rules.realName">
        <a-input v-model:value="formState.realName" show-count :maxlength="30" placeholder="请输入姓名" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
// api
import { updateRealName } from '@/api/userCenter';

// 方法
import { cloneDeep } from 'lodash';

const emits = defineEmits(['saveHandle']);

const visible = ref(false);

let formState = ref({
  realName: undefined, // 分组id
});

const cancelHandle = () => {
  formRef.value && formRef.value.resetFields();
  visible.value = false;
};

const rules = reactive({
  realName: [
    {
      required: true,
      message: '请输入姓名',
    },
  ],
});
const formRef = ref();

const showModal = record => {
  formState.value = cloneDeep(record);
  visible.value = true;
};
const saveHandle = () => {
  formRef.value.validate().then(async () => {
    let params = cloneDeep(formState.value);
    visible.value = false;
    updateRealName(params).then(() => {
      emits('saveHandle', params);
    });
  });
};

defineExpose({ showModal });
</script>
