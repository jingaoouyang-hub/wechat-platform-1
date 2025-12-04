<template>
  <a-modal v-model:visible="visible" title="添加素材" :width="600" @ok="handleOk" @cancel="handleCancel">
    <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" :labelCol="{ style: { width: '100px' } }">
      <a-form-item label="合成类型" name="generateType" required>
        <a-select v-model:value="formState.generateType" :options="generateType" placeholder="请选择合成类型" />
      </a-form-item>
      <a-form-item label="类型" name="type" required>
        <a-select v-model:value="formState.type" :options="TypeList" placeholder="请选择类型" @change="onChangeType" />
      </a-form-item>
      <a-form-item label="素材类型" name="materialType" required>
        <a-select v-model:value="formState.materialType" :options="materialTypeList" placeholder="请选择素材类型" />
      </a-form-item>
      <a-form-item label="背景颜色" name="backgroundColor" required>
        <input type="color" v-model="formState.backgroundColor" placeholder="请选择背景颜色" />
      </a-form-item>
      <a-form-item label="长宽比开始" name="widthHeightStart">
        <a-input-number
          style="width: 100%"
          v-model:value="formState.widthHeightStart"
          placeholder="请输入长宽比开始"
          :min="0"
        />
      </a-form-item>
      <a-form-item label="长宽比结束" name="widthHeightEnd">
        <a-input-number
          style="width: 100%"
          v-model:value="formState.widthHeightEnd"
          placeholder="请输入长宽比结束"
          :min="0"
        />
      </a-form-item>
      <a-form-item label="张数" name="nums">
        <a-input-number style="width: 100%" v-model:value="formState.nums" placeholder="请输入张数" :min="1" />
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
import { postMaterialGenerateType, postMaterialGenerateRandom } from '@/api/wechat-manage/material';
import { postMaterialTypeList } from '@/api/wechat-manage/index';

import { TypeList } from '@/views/constant';

const emit = defineEmits(['ok']);
const visible = ref(false);
const formRef = ref(null);
const formState = reactive({
  backgroundColor: '#ffffff',
  generateType: undefined,
  materialType: undefined,
  type: undefined,
  widthHeightEnd: undefined, // 长宽比结束
  widthHeightStart: undefined, // 长宽比开始
  nums: 1, // 张数
  isOd: true, // 是否需要原图
});
const rules = ref({
  type: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'blur',
    },
  ],
  materialType: [
    {
      required: true,
      message: '请输入素材类型',
      trigger: 'blur',
    },
  ],
});
const generateType = ref([]);
const materialTypeList = ref([]);
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

const onChangeType = type => {
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
    postMaterialGenerateRandom(formState).then(() => {
      visible.value = false;
      emit('ok');
    });
  });
};
const clearFormState = () => {
  Object.assign(formState, {
    backgroundColor: '#ffffff',
    generateType: undefined,
    materialType: undefined,
    type: undefined,
    widthHeightEnd: undefined, // 长宽比结束
    widthHeightStart: undefined, // 长宽比开始
    nums: 1, // 张数
    isOd: true, // 是否需要原图
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
