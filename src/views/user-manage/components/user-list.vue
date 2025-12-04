<template>
  <MainContent>
    <template #title>
      {{ departTreeSelectedItem.name ? departTreeSelectedItem.name + '-' : '' }}
      <span>用户管理列表</span>
      {{ departTreeSelectedItem.name ? ' ' + userTotal + ' 人' : '' }}
    </template>
    <template #titleMore>
      <a-button type="primary" v-power="['add', 'user-manage']" @click="onAddAccount">
        <template #icon>
          <PlusOutlined />
        </template>
        添加
      </a-button>
    </template>
    <template #search>
      <QueryFilter :form-model="queryData" :options="options" @reset="reloadTable" @submit="reloadTable"></QueryFilter>
    </template>
    <template #table>
      <BasicTable
        :after-fetch="afterFn"
        :query-params="{ ...queryData, orgId }"
        :columns="columns"
        :api-fetch="postAccountList"
        @register="registerTable"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space class="space-btn--box" :size="10">
              <a v-if="!record.isSysUser" class="btn" @click="onUpdateAccount(record)">修改</a>
              <a v-if="!record.isSysUser" class="btn" @click="onResetPassword(record)">重置密码</a>
              <a class="btn text-error" v-if="!record.isSysUser" @click="onDeleteAccount(record.id)">删除</a>
              <a v-if="record.loginLock" class="btn" @click="unlock(record.id)">解锁</a>
            </a-space>
          </template>
        </template>
      </BasicTable>
    </template>
  </MainContent>

  <a-modal
    destroy-on-close
    :mask-closable="false"
    :keyboard="false"
    v-model:visible="accountModal"
    :title="formState.id ? '编辑用户' : '添加用户'"
    :width="700"
    :closable="false"
  >
    <template #extra><CloseOutlined class="a-link" @click="onCloseAccountForm" /></template>
    <template #footer>
      <a-space :size="16">
        <a-button @click="onCloseAccountForm">取消</a-button>
        <a-button type="primary" @click="onSaveAccountForm">确定</a-button>
      </a-space>
    </template>

    <a-form layout="vertical" :colon="false" ref="formRef" :model="formState" :rules="rules">
      <a-form-item label="用户名称" name="userName">
        <div v-if="formState.id">{{ formState.userName }}</div>
        <a-input
          v-else
          show-count
          :maxlength="11"
          v-model:value="formState.userName"
          placeholder="请输入用户名称"
        ></a-input>
      </a-form-item>
      <a-form-item label="真实姓名" required name="realName">
        <a-input show-count :maxlength="30" v-model:value="formState.realName" placeholder="请输入真实姓名"></a-input>
      </a-form-item>

      <a-form-item v-if="!formState.id" label="初始密码" required name="password">
        <a-input-password
          v-model:value="formState.password"
          type="password"
          placeholder="请输入初始密码"
        ></a-input-password>
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal
    destroy-on-close
    :mask-closable="false"
    :keyboard="false"
    v-model:visible="pswModal"
    title="重置密码"
    :width="500"
    centered
    @ok="onSaveNewPsw"
  >
    <a-form layout="vertical" :colon="false" ref="pswFormRef" :model="pswState" :rules="resetPasswordRule">
      <a-form-item label="账号名称" name="userName">
        <div>{{ pswState.userName }}</div>
      </a-form-item>
      <a-form-item label="真实姓名" name="realName">
        <div>{{ pswState.realName }}</div>
      </a-form-item>
      <a-form-item label="新密码" required name="password">
        <a-popover placement="topLeft" trigger="focus">
          <template #content>
            <div>请设置8-20位密码，英文、数字、特殊字符最少两种组合</div>
          </template>
          <a-input-password
            v-model:value="pswState.password"
            type="password"
            placeholder="请输入新密码"
          ></a-input-password>
        </a-popover>
      </a-form-item>
      <a-form-item label="确认密码" required name="newPassword">
        <a-popover placement="topLeft" trigger="focus">
          <template #content>
            <div>请设置8-20位密码，英文、数字、特殊字符最少两种组合</div>
          </template>
          <a-input-password
            v-model:value="pswState.newPassword"
            type="password"
            placeholder="请再输入一次密码"
          ></a-input-password>
        </a-popover>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup name="user-manage">
import RULE from '@/setting/rules';
import {
  postAccountList,
  postAccountAdd,
  postAccountUpdate,
  postAccountDelete,
  postAccountResetPsw,
  loginUnlock,
} from '@/api/system/accountApi';

import { doEncrypt } from '@/utils/common';

import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import { createVNode } from 'vue';

import { useTable } from '@/components/BasicTable';

import { getStore } from '@/utils/stroge';
import { SAVE_RSA_KEY } from '@/store/mutation-types';

import MainContent from '@/components/main-content/index.vue';

const props = defineProps({
  departTreeSelected: {
    type: Array,
    default: () => [],
  },
  departTreeSelectedItem: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const options = computed(() => {
  return [
    {
      field: 'realName',
      component: 'Input',
      label: '真实姓名',
    },
  ];
});

// 表格注册方法
const [registerTable, { reloadTable, fetch }] = useTable();

const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '真实姓名', dataIndex: 'realName', key: 'realName', width: 200 },
  { title: '用户名称', dataIndex: 'userName', key: 'userName', width: 150 },
  { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 150 },
  { title: '操作', fixed: 'right', width: 260, dataIndex: 'action', key: 'action' },
];

const rules = {
  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入初始密码', trigger: 'blur' },
    { pattern: RULE.password.pattern, message: RULE.password.msg, trigger: 'blur' },
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: RULE.phone.pattern, message: RULE.phone.msg, trigger: 'blur' },
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
};

let orgId = ref(null);
watch(
  () => props.departTreeSelected,
  newVal => {
    orgId.value = newVal[0] || null;
    fetch();
  },
  { deep: true },
);

const queryData = reactive({
  realName: null,
});

const accountForm = {
  id: '',
  realName: '',
  userName: '',
  password: '',
};

const accountModal = ref(false);
const pswModal = ref(false);
const formRef = ref(null);
const pswFormRef = ref(null);

function afterClose() {
  formRef.value.resetFields();
  Object.keys(formState).forEach(key => {
    formState[key] = accountForm[key];
  });
}

const formState = reactive(Object.assign({}, accountForm));
const pswState = reactive({
  id: '',
  realName: '',
  userName: '',
  password: '',
  newPassword: '',
});
const resetPasswordRule = {
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { pattern: RULE.password.pattern, message: RULE.password.msg, trigger: 'blur' },
  ],
  newPassword: [
    {
      validator: (rule, value, cbfn) => {
        if (!value) {
          // cbfn('请再次输入新密码');
        } else if (value !== pswState.password) {
          cbfn('两次密码不一致');
        }
        cbfn();
      },
      trigger: 'blur',
    },
  ],
};

// 保存用户信息
const onSaveAccountForm = () => {
  formRef.value.validate().then(() => {
    formState.researchCenterId = formState.researchId;
    formState.roleIds = [formState.roleId];

    if (formState.id) {
      postAccountUpdate({
        ...formState,
        // primaryOrgId: formState.primaryOrgNameId.slice(formState.primaryOrgNameId.lastIndexOf('|') + 1),
        // orgIds: formState.orgNameIds.map(i => {
        //   return i.slice(i.lastIndexOf('|') + 1);
        // }),
      }).then(() => {
        message.success('修改成功');
        fetch();
        afterClose();
        accountModal.value = false;
      });
    } else {
      postAccountAdd({
        ...formState,
        // primaryOrgId: formState.primaryOrgNameId.slice(formState.primaryOrgNameId.lastIndexOf('|') + 1),
        // orgIds: formState.orgNameIds.map(i => {
        //   return i.slice(i.lastIndexOf('|') + 1);
        // }),
        password: doEncrypt(formState.password, getStore(SAVE_RSA_KEY)),
      }).then(() => {
        message.success('添加成功');
        afterClose();
        accountModal.value = false;
        fetch();
      });
    }
  });
};
// 关闭弹窗
const onCloseAccountForm = () => {
  afterClose();
  accountModal.value = false;
};

// 修改前获取信息
const onAddAccount = async () => {
  accountModal.value = true;
};
// 修改前获取信息
const onUpdateAccount = record => {
  accountModal.value = true;
  Object.keys(formState).forEach(key => {
    formState[key] = record[key];
  });
};
// 删除用户
const onDeleteAccount = id => {
  Modal.confirm({
    content: '确认要删除该用户吗？',
    icon: () => createVNode(ExclamationCircleFilled),
    onOk() {
      postAccountDelete({ id }).then(() => {
        message.success('删除成功');
        fetch();
      });
    },
  });
};
const unlock = id => {
  Modal.confirm({
    content: '确认要解锁该用户吗？',
    icon: () => createVNode(ExclamationCircleFilled),
    onOk() {
      loginUnlock({ id }).then(() => {
        message.success('解锁成功');
        fetch();
      });
    },
  });
};

const onResetPassword = record => {
  pswModal.value = true;
  pswState.id = record.id;
  pswState.userName = record.userName;
  pswState.realName = record.realName;
  pswState.phoneNumber = record.phoneNumber;
};
const onSaveNewPsw = () => {
  pswFormRef.value.validate().then(() => {
    postAccountResetPsw({
      id: pswState.id,
      newPassword: doEncrypt(pswState.newPassword, getStore(SAVE_RSA_KEY)),
    }).then(() => {
      message.success('重置成功');
      fetch();
      pswFormRef.value.resetFields();
      pswModal.value = false;
    });
  });
};

const userTotal = ref();
const afterFn = (data, { resData }) => {
  userTotal.value = resData.total;
  return data.map(item => {
    return { ...item, roleNameList: item.roleNames ? item.roleNames.split(',') : [] };
  });
};
</script>

<style scoped lang="less"></style>
