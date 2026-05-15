<template>
  <a-modal v-model:visible="visible" title="添加接粉图片" :width="680" @ok="handleOk" @cancel="handleCancel">
    <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" :labelCol="{ style: { width: '200px' } }">
      <a-form-item label="图片名称" name="name" required>
        <a-input v-model:value="formState.name" placeholder="请输入图片名称" />
      </a-form-item>

      <a-form-item class="file-item" label="上传弹窗二维码图片" name="picUrl" required>
        <AvatarUpload v-model:model-value="formState.picUrl" @success="() => uploadSuccess()"/>
      </a-form-item>
      <a-form-item label="文字描述">
        <a-textarea v-model:value="formState.text" placeholder="请输入文字描述"></a-textarea>
      </a-form-item>
      <a-form-item label="启用状态" name="enable" required>
        <a-switch :checked="formState.enable === 1" @change="changeEnable"></a-switch>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import AvatarUpload from '@/components/Upload/AvatarUpload.vue';
import { postWindowFansAdd, postWindowFansUpdate } from '@/api/wechat-manage/window';

const emit = defineEmits(['ok']);
const visible = ref(false);
const formRef = ref(null);

const formState = reactive({
  name: undefined,
  picUrl: undefined,
  enable: 0,
  text: undefined,
});
const rules = ref({
  name: [
    {
      required: true,
      message: '请输入图片名称',
      trigger: 'blur',
    },
  ],
  picUrl: [
    {
      required: true,
      message: '请上传弹窗二维码图片',
      trigger: 'change',
    },
  ],
});

const uploadSuccess  = () => {
  formRef?.value?.validateFields(['picUrl'])
}

const handleOk = () => {
  formRef.value.validate().then(() => {
    let postApi = formState.id ? postWindowFansUpdate : postWindowFansAdd;
    postApi(formState).then(result => {
      visible.value = false;
      clearFormState();
      emit('ok');
    });
  });
};


const clearFormState = () => {
  Object.assign(formState, {
    name: undefined,
    picUrl: undefined,
    enable: 0,
    text: undefined,
    id: undefined
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

const changeEnable = () => {
  formState.enable = formState.enable ? 0 : 1;
};

defineExpose({
  showModal,
  visible,
});
</script>

<style lang="less">
.file-item {
  .ant-form-item-control-input-content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
}
.img-box {
  display: inline-block;
  margin-right: 16px;
  margin-bottom: 16px;
  position: relative;
  img {
    display: inline-block;
    object-fit: cover;
    width: 128px;
    height: 128px;
  }
  .delete-box {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .close-icon {
    font-size: 18px;

    color: #fff;
    &:hover {
      color: #ff2222;
    }
  }
}
</style>
