<template>
  <a-modal v-model:visible="visible" title="移动分组" :width="600" @ok="handleOk" @cancel="handleCancel">
    <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" :labelCol="{ style: { width: '100px' } }">
      <a-form-item label="类型" name="type" required>
        <a-select v-model:value="formState.type" :options="TypeList" placeholder="请选择类型" @change="onChangeType" />
      </a-form-item>
      <a-form-item label="旧素材类型" name="oldMaterialType" required>
        <!-- <a-input  v-model:value="formState.oldMaterialType"  placeholder="请输入旧素材类型"></a-input> -->
        <a-select v-model:value="formState.oldMaterialType" :options="materialTypeList" placeholder="请选择旧素材类型" />
      </a-form-item>
      <a-form-item label="新素材类型" name="newMaterialType" required>
         <a-input  v-model:value="formState.newMaterialType"  placeholder="请输入新素材类型"></a-input>
        <!-- <a-select v-model:value="formState.newMaterialType" :options="materialTypeList" placeholder="请选择新素材类型" /> -->
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { postMoveGroup } from '@/api/wechat-manage/material';
import { postMaterialTypeList } from '@/api/wechat-manage/index';
import { message, Modal } from 'ant-design-vue';
import { TypeList } from '@/views/constant';

const emit = defineEmits(['ok']);
const visible = ref(false);
const formRef = ref(null);
const formState = reactive({
  type: undefined,
  oldMaterialType: undefined,
  newMaterialType: undefined
});
const materialTypeList = ref([]);
const rules = ref({
  type: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'blur',
    },
  ],
  oldMaterialType: [
    {
      required: true,
      message: '请选择旧素材类型',
      trigger: 'blur',
    },
  ],
   newMaterialType: [
    {
      required: true,
      message: '请选择新素材类型',
      trigger: 'blur',
    },
  ],
});

const onChangeType = type => {
  if (!type) {
    queryData.materialType = null;
  }
  postMaterialTypeList({ type }).then(result => {
    materialTypeList.value = result.data.map(t => {
      return {
        value: t,
        label: t,
      };
    });
  });
};

const handleOk = () => {
  formRef.value.validate().then(() => {
    Modal.confirm({
      title: '温馨提示',
      content: `是否确认要将分组"${formState.oldMaterialType}"移入分组"${formState.newMaterialType}"。`,
      onOk() {
        postMoveGroup(formState).then(() => {
          visible.value = false;
          message.success('删除成功');
          emit('ok');
        });
      },
    });
  });
};
const clearFormState = () => {
  Object.assign(formState, {
    type: undefined,
    oldMaterialType: undefined,
    newMaterialType: undefined,
  });
};

const showModal = () => {
  visible.value = true;
  clearFormState();
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
