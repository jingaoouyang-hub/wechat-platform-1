<template>
  <a-modal
    destroy-on-close
    :mask-closable="false"
    :keyboard="false"
    v-model:visible="visible"
    :title="formState.id ? '编辑角色' : '添加角色'"
    :width="700"
    centered
    @ok="onSaveRole"
  >
    <a-form layout="vertical" :colon="false" ref="formRef" :model="formState" :rules="rules">
      <!-- <a-form-item label="角色编号" required name="code">
        <a-input v-model:value="formState.code" show-count :maxlength="20" placeholder="请输入角色编号" :disabled="formState.id ? true : false"></a-input>
      </a-form-item> -->
      <a-form-item label="角色名称" required name="name">
        <a-input
          v-model:value="formState.name"
          v-emoji
          show-count
          :maxlength="30"
          placeholder="请输入角色名称"
        ></a-input>
      </a-form-item>
      <a-form-item label="角色编码" required name="code">
        <a-input
          v-model:value="formState.code"
          v-emoji
          show-count
          :maxlength="30"
          placeholder="请输入角色编码"
          :disabled="Boolean(formState.id)"
        ></a-input>
      </a-form-item>
      <a-form-item label="排序" required name="sortId">
        <a-input-number v-model:value="formState.sortId" style="width: 100%" placeholder="请输入排序"></a-input-number>
      </a-form-item>
      <a-form-item label="状态">
        <a-radio-group v-model:value="formState.status">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="角色描述" name="summary">
        <a-textarea
          v-model:value="formState.summary"
          v-emoji
          show-count
          :maxlength="300"
          placeholder="请输入角色描述"
          :rows="4"
        />
      </a-form-item>
      <!-- <a-form-item v-if="formState.id" label="用户列表">
        <template v-for="user in formState.users" :key="user.userId">
          <a-tag>{{ user.userName }}</a-tag>
        </template>
      </a-form-item> -->
    </a-form>
  </a-modal>
</template>

<script setup>
import { postAddRole, postUpdateRole } from '@/api/system/roleApi';
import RULE from '@/setting/rules';
import { message } from 'ant-design-vue';
import { ROLE_TYPE } from '@/views/system/constant';
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['ok']);

const visible = ref(false);

const rules = {
  // code: [{ required: true, message: '请输入角色编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
  sortId: [
    { required: true, type: 'number', message: '请输入角色排序', trigger: 'blur' },
    { pattern: RULE.number.pattern, message: '排序只能为数字', trigger: 'blur' },
  ],
};

const formStateClone = {
  id: '',
  // code: '',
  name: '',
  sortId: 1,
  status: 1,
  summary: '',
  users: [],
  dataScopeType: 3,
  type: ROLE_TYPE.find(item => item.label === 'Web角色')?.value,
};

const formRef = ref(null);
const formState = reactive(Object.assign({}, formStateClone));

// 保存角色
const onSaveRole = () => {
  formRef.value.validate().then(() => {
    if (formState.id) {
      postUpdateRole(formState).then(() => {
        message.success('修改成功');
        visible.value = false;
        emit('ok');
      });
    } else {
      postAddRole(formState).then(() => {
        message.success('添加成功');
        visible.value = false;
        emit('ok');
      });
    }
  });
};

watch(
  () => visible.value,
  () => {
    if (visible.value) {
      nextTick(() => {
        formRef.value.resetFields();
        if (props.data.id) {
          // 修改
          Object.keys(props.data).forEach(key => {
            formState[key] = props.data[key];
          });
        } else {
          // 新增
          Object.keys(formState).forEach(key => {
            formState[key] = formStateClone[key];
          });
        }
      });
    }
  },
);

defineExpose({
  visible,
});
</script>

<style scoped lang="less"></style>
