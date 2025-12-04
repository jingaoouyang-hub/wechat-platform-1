<template>
  <PageLayout :full-screen="true">
    <div class="h-100 d-flex">
      <a-card
        class="d-flex flex-column flex-shrink h-100 mr-24"
        title="菜单"
        style="width: auto; min-width: 259px; margin-bottom: 24px; margin-right: 24px"
        :body-style="{ display: 'flex', padding: 0, 'flex-direction': 'column', flex: 1, height: 0 }"
      >
        <div class="flex-1 pt-10 pb-10 h-0 overflow-y overflow-x-h pl-24 pr-24">
          <a-directory-tree
            v-if="tree.length"
            :expanded-keys="expandedKeys"
            :selected-keys="selectedKeys"
            :tree-data="tree"
            :show-icon="false"
            @select="selectTree"
            @expand="expandTree"
          />
        </div>
      </a-card>
      <TableLayout class="flex-1 h-100">
        <template #tableTitle>模块资源列表</template>
        <template #tableAction>
          <a-button type="primary" @click="onAddResourceModule()">添加</a-button>
        </template>
        <BasicTable
          :query-params="queryData"
          :columns="columns"
          :api-fetch="postResourceMenuByChildren"
          @register="registerTable"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'statusName'">
              <a-switch v-model:checked="record.status" @change="switchChange" />
            </template>
            <template v-if="column.key == 'name'">
              <a v-if="record.name" class="btn" @click="onQueryMenuById(record)">{{ record.name }}</a>
            </template>
            <template v-if="column.key == 'isSysModule'">
              <CheckOutlined v-if="record.isSysModule" style="color: #52c41a" />
              <CloseOutlined v-else style="color: #f5222d" />
            </template>
            <template v-if="column.key == 'isAuthorize'">
              <CheckOutlined v-if="record.isAuthorize" style="color: #52c41a" />
              <CloseOutlined v-else style="color: #f5222d" />
            </template>
            <template v-if="column.key == 'isMenu'">
              <CheckOutlined v-if="record.isMenu" style="color: #52c41a" />
              <CloseOutlined v-else style="color: #f5222d" />
            </template>
            <template v-if="column.key == 'action'">
              <a-space :size="10" class="space-btn--box">
                <a class="btn" @click="onUpdateResourceModule(record.id)">修改</a>
                <a-dropdown>
                  <a>添加权限</a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item>
                        <a class="btn" @click="onAddDefaultQuery(record.id)">添加默认查询权限</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a class="btn" @click="onAddDefaultEdit(record.id)">添加默认编辑权限</a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
                <a class="btn" @click="onDeleteResourceModule(record.id)">删除</a>
              </a-space>
            </template>
          </template>
        </BasicTable>
      </TableLayout>
    </div>
  </PageLayout>
  <!-- 新增、修改资源菜单 -->
  <ModalResourceAdd ref="modalResourceAddReff" :data="dataDetail" :tree="tree" @ok="resourceOK"></ModalResourceAdd>
</template>

<script setup name="menu-manage">
// 组件
import { createVNode } from 'vue';
import { ExclamationCircleOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons-vue';
import ModalResourceAdd from './components/modal-resource-add.vue';
import {
  postResourceMenuByChildren,
  postResourceModuleDetail,
  postAddDefaultQuery,
  postAddDefaultEdit,
  postDeleteResourceModule,
  postAllTree,
} from '@/api/system/resourceApi';
import { message, Modal } from 'ant-design-vue';

import { BasicTable, useTable } from '@/components/BasicTable';
const [registerTable, { reloadTable, fetch }] = useTable();
const columns = [
  {
    title: '模块名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    ellipsis: true,
  },
  { title: '排序', dataIndex: 'sortId', key: 'sortId', width: 80 },
  { title: '系统', dataIndex: 'isSysModule', key: 'isSysModule', width: 100 },
  // { title: '授权', dataIndex: 'isAuthorize', key: 'isAuthorize', width: 100 },
  { title: '菜单', dataIndex: 'isMenu', key: 'isMenu', width: 100 },
  { title: '路由名称', dataIndex: 'routerName', key: 'routerName', width: 150 },
  { title: 'Url', dataIndex: 'url', key: 'url', width: 250, ellipsis: true },
  { title: '权限URL', dataIndex: 'permissionUrl', key: 'permissionUrl',width: 250, ellipsis: true },
  { title: '备注', dataIndex: 'summary', key: 'summary', width: 120 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 200, fixed: 'right' },
];

const queryData = reactive({
  resourcesType: '1',
  parentId: null,
});

const levelMenu = ref([
  {
    resourcesType: '1',
    parentId: null,
  },
]);
// 根据资源ID查询下级菜单
const onQueryMenuById = record => {
  queryData.resourcesType = record.resourcesType;
  queryData.parentId = record.id;
  levelMenu.value.push(Object.assign({}, queryData));
  reloadTable();
};
// 返回上级菜单
// const onBackQueryMenu = () => {
//   levelMenu.value.pop();
//   let params = levelMenu.value[levelMenu.value.length - 1];
//   queryData.resourcesType = params.resourcesType;
//   queryData.parentId = params.parentId;
// };
// 资源模块 -- 新增、修改
const modalResourceAddReff = ref(null);
const dataDetail = ref({});

// 新增资源模块
const onAddResourceModule = () => {
  dataDetail.value = { parentId: queryData.parentId };
  setTimeout(() => {
    modalResourceAddReff.value.editStatus = false;
    modalResourceAddReff.value.visible = true;
  });
};

// 修改资源模块
const onUpdateResourceModule = id => {
  postResourceModuleDetail({ id }).then(res => {
    dataDetail.value = { ...res.data };
    setTimeout(() => {
      modalResourceAddReff.value.editStatus = true;
      modalResourceAddReff.value.visible = true;
    });
  });
};
// 资源模块 -- 新增、修改后操作
const resourceOK = () => {
  getAllTree();
  fetch();
};

// 删除资源模块
const onDeleteResourceModule = id => {
  Modal.confirm({
    content: '确认要删除该资源模块吗？',
    icon: () => createVNode(ExclamationCircleOutlined),
    onOk() {
      postDeleteResourceModule({ id }).then(result => {
        if (result.code === 200) {
          message.success('删除成功');
          getAllTree();
          fetch();
        }
      });
    },
  });
};
//  添加默认查询权限
const onAddDefaultQuery = resourcesId => {
  Modal.confirm({
    content: '确认要添加默认查询权限吗？',
    icon: () => createVNode(ExclamationCircleOutlined),
    onOk() {
      postAddDefaultQuery({ resModuleId: resourcesId }).then(() => {
        message.success('操作成功');
      });
    },
  });
};
// 添加默认编辑权限
const onAddDefaultEdit = resourcesId => {
  Modal.confirm({
    content: '确认要添加默认编辑权限吗？',
    icon: () => createVNode(ExclamationCircleOutlined),
    onOk() {
      postAddDefaultEdit({ resModuleId: resourcesId }).then(() => {
        message.success('操作成功');
      });
    },
  });
};
// ------------------- 左侧菜单树
const tree = ref([]); // 左侧菜单树
const selectedKeys = ref([]); // 树选中节点
const expandedKeys = ref([]); // 树展开节点
// 获取左侧菜单树
const getAllTree = () => {
  postAllTree().then(result => {
    if (result.code === 200) {
      tree.value = formatTree(result.data);
    }
  });
};
// 处理树
const formatTree = (tree = []) => {
  return tree.map(item => {
    item.isLeaf = false;
    item.key = item.id;
    item.title = item.name;
    delete item.icon;
    if (item.children && item.children.length) {
      formatTree(item.children);
    } else {
      item.isLeaf = true;
    }
    return item;
  });
};
// 点击数节点
const selectTree = (key, { node, selectedNodes }) => {
  // 父节点展开后,再次点击不收缩
  if (!selectedNodes[0].isLeaf) {
    expandedKeys.value.push(key[0]);
  }
  let record = {};
  if (selectedKeys.value[0] === key[0]) {
    selectedKeys.value = [];
    record = { resourcesType: 1 };
  } else {
    selectedKeys.value = key;
    record = node.dataRef;
  }
  onQueryMenuById(record);
};
// 展开树节点
const expandTree = key => {
  expandedKeys.value = key;
};

onMounted(() => {
  getAllTree();
});
</script>

<style scoped lang="less">
.view-content {
  :deep(.slot-content) {
    height: 100%;
    background: transparent;
  }
}
.table-content {
  height: 100%;
  overflow: auto;
}
:deep(.some-switch-item) {
  .ant-form-item-control-input-content {
    display: flex;
    align-items: center;
  }
  .switch-item {
    display: flex;
    align-items: center;
    margin-left: 30px;
  }
}
.resource-form {
  height: 450px;
}
.table-query-tool {
  margin-bottom: 10px;
  display: flex;
  .left-box {
    flex-grow: 1;
  }
}
.icon-ul {
  display: flex;
  flex-wrap: wrap;
  height: 400px;
  overflow-y: auto;
  li {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 150px;
    margin-bottom: 16px;
    cursor: pointer;
    &:hover {
      background: #fafafa;
    }
    .anticon {
      font-size: 24px;
    }
    .name {
      margin-top: 10px;
    }
  }
}

.menu {
  margin-right: 24px;
  min-width: 208px;
  background: #ffffff;
  border-radius: 2px;
  padding: 24px 0;
  height: 100%;
  overflow: auto;
}
:deep(.ant-tree.ant-tree-directory) > li.ant-tree-treenode-selected > span.ant-tree-switcher,
:deep(.ant-tree.ant-tree-directory) .ant-tree-child-tree > li.ant-tree-treenode-selected > span.ant-tree-switcher {
  color: #1890ff;
}
:deep(.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected) {
  background: transparent;
  color: #1890ff !important;
  .lower-level {
    color: #1890ff !important;
  }
}
::v-deep.ant-tree {
  overflow: hidden;
}
::v-deep.ant-tree .ant-tree-node-content-wrapper {
  // width: calc( 100% - 24px );
  position: relative;
}
::v-deep.ant-tree-treenode-selected {
  position: relative;
}

// :deep(.ant-tree-node-content-wrapper.ant-tree-node-selected) {
//   background-color: transparent !important;
//   color: #1890ff !important;
// }
::v-deep.ant-tree li span.ant-tree-switcher {
  z-index: 9 !important;
}
:deep(.ant-tree-title) {
  position: relative;
  z-index: 9;
}
::v-deep.ant-tree.ant-tree-directory li span.ant-tree-node-content-wrapper.ant-tree-node-selected {
  &::before {
    content: '';
    position: absolute;
    left: -300px;
    height: 28px;
    top: 0;
    width: 700px;
    background: #effaff !important;
    z-index: 1;
  }
}
::v-deep.ant-tree.ant-tree-directory li span.ant-tree-node-content-wrapper {
  position: relative;
  &:hover {
    color: #1890ff !important;
    background-color: transparent !important;
    &::before {
      content: '';
      position: absolute;
      left: -300px;
      height: 28px;
      top: 0;
      width: 700px;
      background: #f4f4f4;
      z-index: 1;
    }
  }
}
</style>
