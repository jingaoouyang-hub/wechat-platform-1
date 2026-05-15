<template>
  <a-modal v-model:visible="visible" title="添加接粉图片" :width="680" @ok="handleOk" @cancel="handleCancel">
    <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" :labelCol="{ style: { width: '100px' } }">
      <a-form-item label="图片名称" name="name" required>
        <a-input v-model:value="formState.name" placeholder="请输入图片名称" />
      </a-form-item>

      <a-form-item class="file-item" label="上传接粉图片" name="picUrl" required>
        <AvatarUpload v-model:model-value="formState.picUrl" @success="() => uploadSuccess()" />
      </a-form-item>
      <a-form-item label="字体设置">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-select v-model:value="formState.font" :options="fontList"></a-select>
          </a-col>
          <a-col :span="8">
            <a-select v-model:value="formState.fontSize" :options="fontSizeList"></a-select>
          </a-col>
          <a-col :span="8">
            <input type="color" @change="changeColor" />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="文字描述">
        <a-textarea v-model:value="formState.text" placeholder="请输入文字描述"></a-textarea>
      </a-form-item>
      <a-form-item label="启用状态" name="enable" required>
        <a-switch :checked="formState.enable === 1" @change="changeEnable"></a-switch>
      </a-form-item>
      <a-form-item label="排序" name="sort" required>
        <a-input-number v-model:value="formState.sort"></a-input-number>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import AvatarUpload from '@/components/Upload/AvatarUpload.vue';
import { postFansPicAdd } from '@/api/wechat-manage/fans';

const fontList = ref([
  { label: '宋体', value: 'SimSun, STSong, serif' },
  { label: '黑体', value: 'SimHei, STHeiti, sans-serif' },
  { label: '楷体', value: 'KaiTi, STKaiti, serif' },
  { label: '仿宋', value: 'FangSong, STFangsong, serif' },
  { label: '微软雅黑', value: 'Microsoft YaHei, sans-serif' },
  { label: '隶书', value: 'LiSu, ‘LiSu’, cursive' },
  { label: '华文细黑', value: 'STXihei' },
  { label: '华文楷体', value: 'STKaiti' },
  { label: '华文宋体', value: 'STSong' },
  { label: '华文仿宋', value: 'STFangsong' },
  { label: '方正舒体', value: 'FZShuTi' },
  { label: '方正姚体', value: 'FZYaoti' },
  { label: '华文彩云', value: 'STCaiyun' },
  { label: '华文琥珀', value: 'STHupo' },
  { label: '华文隶书', value: 'STLiti' },
  { label: '华文行楷', value: 'STXingkai' },
  { label: '华文新魏', value: 'STXinwei' },
]);

const fontSizeList = Array.from({ length: 112 }).map((t, i) => ({ label: i + 12, value: i + 12 }));

const emit = defineEmits(['ok']);
const visible = ref(false);
const formRef = ref(null);

const formState = reactive({
  name: undefined,
  picUrl: undefined,
  enable: 0,
  sort: undefined,
  fontSize: undefined,
  font: undefined,
  color: undefined,
  text: undefined
});
const rules = ref({
  name: [
    {
      required: true,
      message: '请输入图片名称',
      trigger: 'blur',
    },
  ],
  sort: [
    {
      required: true,
      message: '请输入序号',
      trigger: 'blur',
    },
  ],
  picUrl: [
    {
      required: true,
      message: '请上传接粉图片',
      trigger: 'change',
    },
  ],
});

const handleOk = () => {
  formRef.value.validate().then(() => {
    postFansPicAdd(formState).then(result => {
      visible.value = false;
      clearFormState();
      emit('ok');
    });
  });
};

const uploadSuccess  = () => {
  formRef?.value?.validateFields(['picUrl'])
}

const changeColor = e => {
  formState.color = e.target.value;
};

const clearFormState = () => {
  Object.assign(formState, {
    name: undefined,
    picUrl: undefined,
    enable: 0,
    sort: undefined,
    fontSize: undefined,
    font: undefined,
    color: undefined,
    text: undefined
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
