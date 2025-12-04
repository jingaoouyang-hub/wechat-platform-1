<template>
  <MainContent>
    <template #title>角色列表</template>
    <template #titleMore>
      <a-button v-power="['add']" type="primary" @click="addEdit('add')">
        <template #icon>
          <PlusOutlined />
        </template>
        添加角色
      </a-button>
    </template>
    <template #search>
      <QueryFilter :form-model="queryData" :options="options" @reset="reloadTable" @submit="onQueryDataByParams">
        <!-- <a-form-item label="角色名称" name="name">
          <a-input v-model:value="queryData.name" placeholder="请输入角色名称" />
        </a-form-item> -->
      </QueryFilter>
    </template>
    <template #table>
      <BasicTable :query-params="queryData" :columns="columns" :api-fetch="postRoleList" @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="record.status === 1 ? 'success' : 'error'">
              {{ record.status === 1 ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-space v-if="!record.isSysRole" :size="10" class="space-btn--box">
              <a v-power="['queryUser']" class="btn" @click="lookUser(record)">查看成员</a>
              <a v-power="['update']" class="btn" @click="addEdit('edit', record.id)">修改</a>
              <a v-power="['operationAuthorization']" class="btn" @click="onGivesRoleSomeAllAuthorize(record)">
                操作授权
              </a>
              <!-- <a-dropdown>
                <a>授权</a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a v-power="['operationAuthorization']" class="btn" @click="onGivesRoleSomeAllAuthorize(record)">
                        操作授权
                      </a>
                    </a-menu-item>
                    <a-menu-item>
                      <a v-power="['dataAuthorization']" class="btn" @click="dataAuthorize(record)">数据授权</a>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown> -->
              <a
                v-power="['delete']"
                v-if="!['admin', 'researcher', 'researcher_assistant'].includes(record.code)"
                class="btn text-error"
                @click="onDeleteRole(record.id)"
              >
                删除
              </a>
            </a-space>
            <a v-else class="btn">无</a>
          </template>
        </template>
      </BasicTable>
    </template>
  </MainContent>

  <!-- 添加、修改 -->
  <ModalRoleEdit ref="modalRoleEditRef" :data="dataRecord" @ok="onSearch"></ModalRoleEdit>
  <!-- 操作授权 -->
  <ModalRoleAuthorize ref="modalRoleAuthorizeRef" :data="dataRecord" @ok="onSearch"></ModalRoleAuthorize>
  <!-- 数据授权 -->
  <ModalDataAuthorize ref="modalDataAuthorizeRef" :data="dataRecord" @ok="onSearch"></ModalDataAuthorize>

  <ModalRoleUser ref="modalRoleUserRef" :role-id="dataRecord.id"></ModalRoleUser>

  <a-modal v-model:visible="disableVisible" title="禁用" @ok="handleOk" @cancel="cancel">
    <p>确定禁用该角色？</p>
  </a-modal>
</template>

<script setup name="role-manage">
import { BasicTable, useTable } from '@/components/BasicTable';
import ModalRoleEdit from './components/modal-role-edit.vue';
import ModalRoleAuthorize from './components/modal-role-authorize.vue';
import ModalDataAuthorize from './components/modal-data-authorize.vue';
import ModalRoleUser from './components/modal-role-user.vue';
import MainContent from '@/components/main-content/index.vue';

import { postRoleList, postRoleDetail, postDeleteRole, postStatusUpdate } from '@/api/system/roleApi';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
const [registerTable, { reloadTable, fetch }] = useTable();

const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '角色名称', dataIndex: 'name', key: 'name', width: 200, ellipsis: true },
  { title: '角色编码', dataIndex: 'code', key: 'code', width: 200, ellipsis: true },
  { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 200, ellipsis: true },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '排序', dataIndex: 'sortId', key: 'sortId', width: 60 },
  // { title: '系统', dataIndex: 'sysRole', key: 'sysRole', width: 100, slots: { customRender: 'sysRole' } },
  { title: '角色描述', dataIndex: 'summary', key: 'summary', ellipsis: true, width: 300 },
  // { title: '创建人', dataIndex: 'createdUserName', key: 'createdUserName', ellipsis: true },
  { title: '操作', dataIndex: 'action', fixed: 'right', width: 300, key: 'name' },
];
const options = computed(() => {
  return [
    {
      field: 'name',
      component: 'Input',
      label: '角色名称',
    },
  ];
});
const onQueryDataByParams = () => {
  reloadTable();
};
const disableVisible = ref(false);
const roleId = ref('');
const queryData = reactive({
  name: '',
});
// 搜索
const onSearch = () => {
  fetch();
};

// const switchChange = (status, id) => {

//   const params = { id, status };
//   if (status === 1) {
//     Modal.confirm({
//       title: '禁用',
//       icon: h(ExclamationCircleFilled),
//       content: '确定禁用该角色？',
//       okText: '禁用',
//       cancelText: '取消',
//       onOk() {
//         onRoleUpdatestatus(params);
//       },
//       onCancel() {
//         fetch();
//       },
//     });
//     return;
//   }
//   onRoleUpdatestatus();
// };

const handleOk = () => {
  postStatusUpdate({
    id: roleId.value,
    status: 2,
  }).then(res => {
    if (res.code == 200) {
      message.success('修改成功');
      fetch();
      cancel();
    }
  });
};
const cancel = () => {
  disableVisible.value = false;
  fetch();
};
const dataRecord = ref({});

// 查看成员
const modalRoleUserRef = ref(null);
// const onGivesRoleSomeAllAuthorize = record => {
//   dataRecord.value = record;
//   setTimeout(() => {
//     modalRoleAuthorizeRef.value.visible = true;
//   }, 0);
// };
const lookUser = record => {
  dataRecord.value = record;
  modalRoleUserRef.value.showModal();
};

// 操作授权
const modalRoleAuthorizeRef = ref(null);
const onGivesRoleSomeAllAuthorize = record => {
  dataRecord.value = record;
  setTimeout(() => {
    modalRoleAuthorizeRef.value.visible = true;
  }, 0);
};
// 数据授权
const modalDataAuthorizeRef = ref(null);
// const dataAuthorize = record => {
//   dataRecord.value = record;
//   setTimeout(() => {
//     modalDataAuthorizeRef.value.visible = true;
//   }, 0);
// };
// 添加、修改
const modalRoleEditRef = ref(null);
const addEdit = async (flag, id) => {
  if (flag === 'add') {
    dataRecord.value = {};
  } else {
    const data = await postRoleDetail({ id });
    dataRecord.value = data.data;
  }
  setTimeout(() => {
    modalRoleEditRef.value.visible = true;
  }, 0);
};
// 删除角色
const onDeleteRole = id => {
  Modal.confirm({
    title: '系统提醒',
    content: '是否确认删除该角色？删除后，当前获得该角色权限的用户，可能失去对应的权限。',
    icon: () => createVNode(ExclamationCircleFilled),
    onOk() {
      postDeleteRole({ id }).then(result => {
        if (result.code === 200) {
          message.success('删除成功');
          fetch();
        }
      });
    },
  });
};
// 给与角色所有权限
// const onGiveRoleAllAuthorize = (id) => {
//   Modal.confirm({
//     content: '确认要授予该角色所有权限吗？',
//     icon: () => createVNode(ExclamationCircleFilled),
//     onOk() {
//       postRoleAllAuthorize({ id }).then((result) => {
//         if (result.code === 200) {
//           message.success('授权成功');
//           tableRef.value.refreshTableData();
//         }
//       });
//     },
//   });
// };
</script>

<style scoped lang="less">
.h-100 {
  ::v-deep .slot-content {
    background-color: #ffffff;
  }
}
</style>
