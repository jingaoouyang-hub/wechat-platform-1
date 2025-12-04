<template>
  <div>
    <a-modal
      destroy-on-close
      :mask-closable="false"
      :keyboard="false"
      v-model:visible="visible"
      :title="editStatus ? '编辑权限' : '添加权限'"
      :width="700"
      centered
      @ok="onSavePermission"
    >
      <a-form layout="vertical" :colon="false" ref="formRef" :model="powerState" :rules="powerRules">
        <a-form-item label="名称" required name="name">
          <a-input v-model:value="powerState.name" placeholder="请输入权限名称"></a-input>
        </a-form-item>
        <a-form-item label="友好名称" required name="friendlyName">
          <a-input v-model:value="powerState.friendlyName" placeholder="请输入友好名称"></a-input>
        </a-form-item>
        <a-form-item label="权限URL" name="permissionUrl">
          <a-textarea
            v-model:value="powerState.permissionUrl"
            placeholder="请输入权限URL,多个Url采英文分号或回车换行"
            :rows="2"
          />
        </a-form-item>
        <a-form-item label="是否必选">
          <a-switch v-model:checked="powerState.isRequired" checked-children="开" un-checked-children="关" />
        </a-form-item>
        <a-form-item label="排序" name="sortId">
          <a-input-number
            v-model:value="powerState.sortId"
            style="width: 100%"
            placeholder="请输入排序"
          ></a-input-number>
        </a-form-item>
        <a-form-item label="备注" name="summary">
          <a-textarea v-model:value="powerState.summary" placeholder="请输入权限描述" :rows="2" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { postAddPermission, postUpdatePermission } from '@/api/system/sysPermissionApi';
import { message } from 'ant-design-vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['ok']);
const visible = ref(false);

const powerRules = {
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  friendlyName: [{ required: true, message: '请输入友好名称', trigger: 'blur' }],
};

const formRef = ref(null);
const editStatus = ref(false);

let powerState = reactive({
  friendlyName: '', // 友好名称
  name: '', // 名称
  permissionUrl: '', // 权限URL
  resModuleId: '', // 资源ID
  sortId: 1, // 排序
  summary: '', // 备注
  id: '',
  isRequired: false,
});

// 模块权限 -- 添加、修改请求
const onSavePermission = () => {
  formRef.value.validate().then(() => {
    if (powerState.id) {
      postUpdatePermission(powerState).then(result => {
        if (result.code === 200) {
          message.success('修改成功');
          visible.value = false;
          emit('ok');
        }
      });
    } else {
      postAddPermission(powerState).then(result => {
        if (result.code === 200) {
          message.success('添加成功');
          visible.value = false;
          emit('ok');
        }
      });
    }
  });
};

watch(
  () => visible.value,
  () => {
    if (visible.value) {
      Object.assign(powerState, props.data);
    } else {
      formRef.value.resetFields();
      Object.assign(powerState, {
        friendlyName: '', // 友好名称
        name: '', // 名称
        permissionUrl: '', // 权限URL
        resModuleId: '', // 资源ID
        sortId: 1, // 排序
        summary: '', // 备注
        id: '',
        isRequired: false,
      });
    }
  },
);

defineExpose({
  visible,
  editStatus,
});
</script>

<style lang="less" scoped></style>
