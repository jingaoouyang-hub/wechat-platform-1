<template>
  <a-modal
    destroy-on-close
    :mask-closable="false"
    :keyboard="false"
    v-model:visible="visible"
    title="数据权限"
    :width="700"
    @ok="onSave"
  >
    <a-form layout="vertical" :colon="false" ref="formRef" :model="formState" :rules="rules">
      <a-form-item label="权限范围" name="dataScopeType">
        <a-select
          v-model:value="formState.dataScopeType"
          style="width: 100%"
          placeholder="请选择"
          :options="DATA_AUTH"
          @change="dataScopeTypeChange"
        ></a-select>
      </a-form-item>
      <a-form-item v-show="formState.dataScopeType === 4" class="dept-form-item" label="选择部门" name="dept">
        <a-tree
          v-model:checkedKeys="formState.orgIdList"
          :tree-data="orgTree"
          :default-expand-all="true"
          :field-names="{ children: 'children', title: 'name', key: 'id' }"
          checkable
        ></a-tree>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { postRoleAuthDatascope, postOrgTreeAll } from '@/api/system/roleApi';
import { DATA_AUTH } from '@/views/system/constant';
import { message } from 'ant-design-vue';
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['ok']);

const visible = ref(false);

const rules = ref({
  dataScopeType: [{ required: true, message: '请输入权限范围' }],
  orgIdList: [{ required: false, type: 'array', message: '请输入权限范围' }],
});

const formStateClone = {
  id: '',
  dataScopeType: undefined,
  orgIdList: undefined,
};

const formRef = ref(null);
const formState = reactive(Object.assign({}, formStateClone));

onMounted(() => {
  getOrgTree();
});
const orgTree = ref([]);
// 获取部门树
const getOrgTree = () => {
  postOrgTreeAll().then(res => {
    orgTree.value = res.data || [];
  });
};

// 权限范围选择
const dataScopeTypeChange = val => {
  if (val === 4) {
    rules.value.orgIdList[0].required = true;
  } else {
    rules.value.orgIdList[0].required = false;
  }
};

// 确认
const onSave = () => {
  formRef.value.validate().then(() => {
    postRoleAuthDatascope(formState).then(() => {
      message.success('授权成功');
      visible.value = false;
      emit('ok');
    });
  });
};

watch(
  () => visible.value,
  () => {
    if (visible.value) {
      nextTick(() => {
        formRef.value.resetFields();
        Object.keys(formState).forEach(key => {
          formState[key] = props.data[key];
        });
      });
    }
  },
);

defineExpose({
  visible,
});
</script>

<style scoped lang="less">
.dept-form-item {
  :deep(.ant-form-item-control) {
    border: 1px solid #ebebeb;
    padding: 6px;
    height: 250px;
    overflow: auto;
    .ant-form-item-control-input-content {
      height: 100%;
    }
  }
}
</style>
