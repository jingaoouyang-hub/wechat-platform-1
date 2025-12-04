<template>
  <MainContent>
    <template #title>
      {{ departTreeSelectedItem.name ? departTreeSelectedItem.name + '-' : '' }}
      <span>用户管理列表</span>
      {{ departTreeSelectedItem.name ? ' ' + userTotal + ' 人' : '' }}
    </template>
    <template #titleMore>
      <a-button v-power="['add', 'user-manage']" type="primary" @click="onAddAccount">
        <template #icon>
          <PlusOutlined />
        </template>
        添加
      </a-button>
    </template>
    <template #search>
      <QueryFilter :form-model="queryData" :options="options" @reset="reloadTable" @submit="reloadTable">
        <!-- <a-form-item label="姓名" name="realName">
          <a-input v-model:value="queryData.realName" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="账号" name="userName">
          <a-input v-model:value="queryData.userName" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item label="绑定手机" name="phoneNumber">
          <a-input v-model:value="queryData.phoneNumber" placeholder="请输入绑定手机" />
        </a-form-item> -->
      </QueryFilter>
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
          <template v-if="column.key === 'roles'">
            <div class="d-flex flex-wrap">
              <a-tag class="mt-6 mr-6" v-for="(roleName, index) in record.roleNameList" :key="index" color="processing">
                {{ roleName }}
              </a-tag>
            </div>
          </template>
          <template v-if="column.key === 'statusName'">
            <div class="flex-start line-height-1">
              <a-switch
                :disabled="record.isSysUser"
                :checked="record.status"
                :checked-value="1"
                :un-checked-value="0"
                @change="switchChange($event, record.id)"
              />
              <LockOutlined v-if="record.loginLock" class="text-primary ml-10" />
            </div>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space class="space-btn--box" :size="10">
              <a
                v-power="['update', 'user-manage']"
                v-if="!record.isSysUser"
                class="btn"
                @click="onUpdateAccount(record.id)"
              >
                修改
              </a>
              <a
                v-power="['resetPwd', 'user-manage']"
                v-if="!record.isSysUser"
                class="btn"
                @click="onResetPassword(record)"
              >
                重置密码
              </a>
              <a
                v-power="['delete', 'user-manage']"
                class="btn text-error"
                v-if="!record.isSysUser"
                @click="onDeleteAccount(record.id)"
              >
                删除
              </a>
              <a
                v-power="['loginUnlock', 'user-manage']"
                v-if="record.loginLock"
                class="btn"
                @click="unlock(record.id)"
              >
                解锁
              </a>
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
      <!-- <a-form-item label="主组织" name="primaryOrgNameId">
        <a-tree-select
          v-model:value="formState.primaryOrgNameId"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择"
          allow-clear
          tree-default-expand-all
          :tree-data="departTreeData"
        ></a-tree-select>
      </a-form-item>
      <a-form-item label="附属组织" name="orgNameIds">
        <a-tree-select
          v-model:value="formState.orgNameIds"
          multiple
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择"
          allow-clear
          tree-default-expand-all
          :tree-data="departTreeData"
        ></a-tree-select>
      </a-form-item> -->
      <!-- <a-form-item label="手机号" required name="userName">
        <div v-if="formState.id">{{ formState.userName }}</div>
        <a-input
          show-count
          :maxlength="30"
          v-else
          v-model:value="formState.userName"
          placeholder="请输入账号"
        ></a-input>
      </a-form-item> -->
      <a-form-item label="手机号" name="phoneNumber">
        <div v-if="formState.id">{{ formState.phoneNumber }}</div>
        <a-input
          v-else
          show-count
          :maxlength="11"
          v-model:value="formState.phoneNumber"
          placeholder="请输入手机号码"
        ></a-input>
      </a-form-item>
      <a-form-item label="姓名" required name="realName">
        <a-input show-count :maxlength="30" v-model:value="formState.realName" placeholder="请输入姓名"></a-input>
      </a-form-item>
      <!-- <a-form-item label="直属上级" name="directSupervisorId">
        <a-select
          v-model:value="formState.directSupervisorId"
          show-search
          allow-clear
          placeholder="请搜索直属上级名称（默认显示前10名用户）"
          style="width: 100%"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          :options="searchUserList"
          @search="handleSearchUser"
        >
          <template v-if="searchUserLoading" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
      </a-form-item> -->
      <a-form-item v-if="!formState.id" label="初始密码" required name="password">
        <a-input-password
          v-model:value="formState.password"
          type="password"
          placeholder="请输入初始密码"
        ></a-input-password>
      </a-form-item>
      <a-form-item label="所属角色" name="roleId">
        <a-select
          v-model:value="formState.roleId"
          show-search
          allow-clear
          placeholder="请绑定用户的角色"
          style="width: 100%"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          :options="searchRoleList"
          @search="handleSearchRole"
        >
          <template v-if="searchRoleLoading" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
      </a-form-item>
      <!-- <a-form-item label="绑定手机" name="phoneNumber">
        <a-input
          show-count
          :maxlength="30"
          v-model:value="formState.phoneNumber"
          placeholder="请输入手机号码"
        ></a-input>
      </a-form-item> -->

      <a-form-item label="归属机构" name="researchId">
        <a-select
          v-model:value="formState.researchId"
          :options="orgOptions"
          :fieldNames="{ label: 'name', key: 'id', value: 'id' }"
        ></a-select>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="formState.status">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- <a-form-item label="绑定邮箱" name="emailAddress">
        <a-input show-count :maxlength="30" v-model:value="formState.emailAddress" placeholder="请输入邮箱"></a-input>
      </a-form-item> -->
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
      <a-form-item label="账号" name="phoneNumber">
        <div>{{ pswState.phoneNumber }}</div>
      </a-form-item>
      <a-form-item label="姓名" name="realName">
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
  postAccountSingle,
  postAccountResetPsw,
  postAccountUpdatestatus,
  loginUnlock,
} from '@/api/system/accountApi';

import { postCenterList } from '@/api/research-center-manage/index.ts';
import { doEncrypt } from '@/utils/common';

import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import { createVNode, onMounted } from 'vue';

import { useTable } from '@/components/BasicTable';

import { getStore } from '@/utils/stroge';
import { SAVE_RSA_KEY } from '@/store/mutation-types';
import { useSearchUser } from '@/hooks/useSearchUser';
import { useSearchRole } from '@/hooks/useSearchRole';
import { queryDepartment } from '@/api/system/departmentApi';
import MainContent from '@/components/main-content/index.vue';

// 搜索用户相关
const { getSearchUserList } = useSearchUser();
// 搜索用户相关 end

// 搜索角色相关
const { searchRoleList, searchRoleLoading, handleSearchRole, getSearchRoleList } = useSearchRole();
// 搜索角色相关 end

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
      label: '姓名',
    },
    // {
    //   field: 'userName',
    //   component: 'Input',
    //   label:'账号',

    // },
    {
      field: 'phoneNumber',
      component: 'Input',
      label: '手机号',
    },
  ];
});

// 表格注册方法
const [registerTable, { reloadTable, fetch }] = useTable();

const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '姓名', dataIndex: 'realName', key: 'realName', width: 100 },
  // { title: '账号', dataIndex: 'userName', key: 'userName', width: 150 },
  { title: '手机号', dataIndex: 'phoneNumber', key: 'phoneNumber', width: 150 },
  { title: '归属机构', dataIndex: 'researchCenter', key: 'researchCenter', width: 150 },
  { title: '所属角色', dataIndex: 'roleName', key: 'roleName', width: 150 },
  { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 150 },
  { title: '状态', dataIndex: 'statusName', key: 'statusName', width: 150 },
  { title: '操作', fixed: 'right', width: 260, dataIndex: 'action', key: 'action' },
];

const rules = {
  primaryOrgNameId: [{ required: true, message: '请选择主组织', trigger: 'blur' }],
  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入初始密码', trigger: 'blur' },
    { pattern: RULE.password.pattern, message: RULE.password.msg, trigger: 'blur' },
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: RULE.phone.pattern, message: RULE.phone.msg, trigger: 'blur' },
  ],
  researchId: [{ required: true, message: '请选择研究机构', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
};

const orgOptions = ref([]);

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
  // userName: null,
  phoneNumber: null,
});

const accountForm = {
  id: '',
  phoneNumber: '',
  realName: '',
  userName: '',
  password: '',
  roleIds: [],
  roleId: '',
  researchCenter: '',
  researchId: '',
  researchCenterId: '',
  // orgIds: [],
  // orgNameIds: [],
  // emailAddress: '',
  status: 1,
  // primaryOrgId: undefined,
  // primaryOrgNameId: undefined,
};

const switchChange = (status, id) => {
  const params = { id, status };
  if (!status) {
    Modal.confirm({
      title: '禁用',
      icon: h(ExclamationCircleFilled),
      content: '确定禁用该账号？',
      okText: '禁用',
      cancelText: '取消',
      onOk() {
        onAccountUpdatestatus(params);
      },
      onCancel() {
        fetch();
      },
    });
    return;
  }
  onAccountUpdatestatus(params);
};

// 部门接口
let departTreeData = ref([]);
function getDepartTree() {
  queryDepartment({
    name: '',
  }).then(res => {
    departTreeData.value = deptFlat(res.data); // demo(res.data);
  });
}

const deptFlat = arr => {
  return arr.map(i => {
    return {
      children: deptFlat(i.children),
      label: i.name,
      value: `${i.name}|${i.id}`,
    };
  });
};

// 修改账号状态
const onAccountUpdatestatus = params => {
  postAccountUpdatestatus(params).then(() => {
    fetch();
    message.success('操作成功');
  });
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
  phoneNumber: '',
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

onMounted(() => {
  postCenterList().then(res => {
    orgOptions.value = res.data;
  });
});

watch(
  () => accountModal.value,
  () => {
    if (accountModal.value) {
      getDepartTree();
    }
  },
);

// watch(
//   () => accountModal.value,
//   () => {
//     if (accountModal.value) {
//       nextTick(() => {
//         formRef.value.resetFields();
//         Object.keys(formState).forEach(key => {
//           formState[key] = accountForm[key];
//         });
//       });
//     }
//   },
// );

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
  await getSearchRoleList();
  await getSearchUserList();
  accountModal.value = true;
  // formState.orgIds = props.departTreeSelected;
};
// 修改前获取信息
const onUpdateAccount = async id => {
  accountModal.value = true;
  await getSearchRoleList();
  await getSearchUserList();
  postAccountSingle({ id }).then(result => {
    Object.keys(formState).forEach(key => {
      formState[key] = result.data[key];
    });
    // formState.roleIds = result.data.roles.map(o => o.roleId);
    formState.roleId = result.data.roleIds.join('');
    formState.researchId = result.data.researchCenterId;
    console.log(formState.researchId, 'formState.researchId');
    // formState.orgIds = result.data.orgs.map(o => o.orgId);
    // formState.primaryOrgId = result.data.primaryOrg.orgId;
    // formState.primaryOrgNameId = `${result.data.primaryOrg.name}|${result.data.primaryOrg.orgId}`;
    // formState.orgNameIds = result.data.orgs.map(i => {
    //   return `${i.name}|${i.orgId}`;
    // });
    // if (result.data.directSupervisor) {
    //   formState.directSupervisorId = result.data.directSupervisor.id;
    //   setDefaultSearchUserList(result.data.directSupervisor.id);
    // }
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
      // pswFormRef.value.resetFcallbackields();
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
