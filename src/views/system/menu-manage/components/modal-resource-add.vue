<template>
  <a-modal
    destroy-on-close
    :mask-closable="false"
    :keyboard="false"
    v-model:visible="visible"
    :title="editStatus ? '编辑模块' : '添加模块'"
    :width="700"
    @ok="onSaveResourceInfo"
  >
    <a-form layout="vertical" :colon="false" ref="formRef" class="resource-form" :model="formState" :rules="rules">
      <a-tabs v-model:activeKey="tabActive" @change="onchangeTab">
        <a-tab-pane key="1" tab="模块信息">
          <a-form-item label="上级菜单">
            <!-- <a-input v-model:value="formState.id" placeholder="请输入资源ID"></a-input> -->
            <a-tree-select
              v-model:value="formState.parentId"
              v-model:treeExpandedKeys="parentExpandedKeys"
              :tree-data="tree"
              :field-names="{ children: 'children', title: 'name', key: 'id', value: 'id' }"
              placeholder="请选择上级菜单"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              allow-clear
              show-search
            ></a-tree-select>
          </a-form-item>
          <a-form-item label="名称" required name="name">
            <a-input v-model:value="formState.name" placeholder="请输入名称"></a-input>
          </a-form-item>
          <a-form-item label="路由名称" name="routerName">
            <a-input v-model:value="formState.routerName" placeholder="请输入路由标识"></a-input>
          </a-form-item>
          <a-form-item label="排序" required name="sortId">
            <a-input-number
              v-model:value="formState.sortId"
              style="width: 100%"
              placeholder="请输入排序"
            ></a-input-number>
          </a-form-item>
          <a-form-item label="备注" name="summary">
            <a-textarea v-model:value="formState.summary" placeholder="请输入模块描述" :rows="3" />
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="2" tab="配置项">
          <a-form-item label="图标" name="icon">
            <a-popover placement="right" trigger="click" overlayClassName="select-icon-popover">
              <template #content>
                <div class="icon-box">
                  <div
                    class="icon-item"
                    :class="formState.icon === item ? 'active' : ''"
                    v-for="item in CONST_ICON"
                    :key="item"
                    @click="formState.icon = item"
                    :title="item"
                  >
                    <SvgIcon :name="item" />
                  </div>
                  <div class="icon-last" v-for="item in 6 - (CONST_ICON.length % 6)" :key="item"></div>
                </div>
              </template>
              <span class="select-icon-box" :class="formState.icon !== '' ? 'active' : ''">
                <SvgIcon :name="formState.icon ? formState.icon : 'PlusOutlined'" />
              </span>
            </a-popover>

            <span class="ml-10 a-link primary" @click="handleC">清空</span>
            <!--<a-input-search
              v-model:value="formState.icon"
              placeholder="请输入图标"
              enter-button
              @search="iconModal = true"
            />-->
          </a-form-item>
          <a-form-item label="URL" name="url">
            <a-input v-model:value="formState.url" placeholder="请输入URL"></a-input>
          </a-form-item>
          <!-- <a-form-item label="权限URL" name="permissionUrl">
            <a-input v-model:value="formState.permissionUrl" placeholder="请输入权限URL"></a-input>
          </a-form-item> -->
          <a-form-item label="是否菜单">
            <a-switch v-model:checked="formState.isMenu" checked-children="开" un-checked-children="关" />
          </a-form-item>
          <a-form-item label="系统模块">
            <a-switch v-model:checked="formState.isSysModule" checked-children="开" un-checked-children="关" />
          </a-form-item>
          <!--<a-form-item label="需要授权">
            <a-switch v-model:checked="formState.isAuthorize" checked-children="开" un-checked-children="关" />
          </a-form-item>-->
          <a-form-item label="是否必选">
            <a-switch v-model:checked="formState.isRequired" checked-children="开" un-checked-children="关" />
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="3" tab="模块权限">
          <div class="table-query-tool">
            <div class="left-box">
              <a-button type="primary" @click="addPermission">
                <template #icon>
                  <PlusOutlined />
                </template>
                添加
              </a-button>
            </div>
            <a-input-search
              v-model:value="powerQueryData.name"
              style="width: 250px"
              placeholder="请输入关键字查询"
              enter-button
              @search="onSearchPowerList"
            />
          </div>
          <BasicTable
            :query-params="powerQueryData"
            :columns="powerColumns"
            :api-fetch="postPermissionPage"
            @register="registerTable"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-space :size="10" class="space-btn--box">
                  <a class="btn" @click="onUpdatePermission(record.id)">修改</a>
                  <a class="btn red-btn" @click="onDeletePermission(record.id)">删除</a>
                </a-space>
              </template>
            </template>
          </BasicTable>
        </a-tab-pane>
      </a-tabs>
    </a-form>
  </a-modal>
  <!--<a-modal
    destroy-on-close
    :mask-closable="false"
    :keyboard="false"
    v-model:visible="iconModal"
    title="选择图标"
    :width="700"
    centered
    :footer="null"
  >
    <ul class="icon-ul">
      <li v-for="icon in CONST_ICON" :key="icon" @click="onCheckedIcon(icon)">
        <SvgIcon class="anticon" color="#333" :name="icon"></SvgIcon>
        <div class="name">{{ icon }}</div>
      </li>
    </ul>
  </a-modal>-->
  <!-- 新增、修改模块权限 -->
  <ModalPowerAdd ref="modalPowerAddReff" :data="dataDetail" @ok="powerOK"></ModalPowerAdd>
</template>

<script setup>
// 组件
import { createVNode } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import ModalPowerAdd from './modal-power-add.vue';
// api
import { postAddResourceModule, postUpdateResourceModule } from '@/api/system/resourceApi';
import { postPermissionPage, postDeletePermission, postPermissionDetail } from '@/api/system/sysPermissionApi';

import RULE from '@/setting/rules';
import { BasicTable, useTable } from '@/components/BasicTable';
import { antIconNamesFilled } from '@/plugins/icon';
import iconJson from '@/components/svg-icon/icon/iconfont.json';

// 文件夹icons里的svg图标
// import svgIcons from 'virtual:svg-icons-names';
// 阿里图标库图标
// import iconfontDatas from '@/assets/font-icons/iconfont.json';
// function getIcons() {
//   const svgIconNames = svgIcons.map(icon => icon.replace('icon-', ''));
//   const iconFontNames = iconfontDatas.glyphs.map(icon => icon.name);
//   return [...svgIconNames, ...iconFontNames];
// }
// const CONST_ICON = getIcons();
const CONST_ICON = [
  ...antIconNamesFilled(),
  ...iconJson.glyphs.map(item => {
    return iconJson.css_prefix_text + item.name;
  }),
];

const [registerTable, { reloadTable, fetch }] = useTable();
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  tree: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['ok']);
const visible = ref(false);
const editStatus = ref(false);
const rules = {
  name: [{ required: true, message: '请输入模块名称', trigger: 'blur' }],
  id: [{ required: true, message: '请输入资源ID', trigger: 'blur' }],
  customName: [{ required: true, message: '请输入回显名称', trigger: 'blur' }],
  sortId: [
    { required: true, type: 'number', message: '请输入排序', trigger: 'blur' },
    { pattern: RULE.number.pattern, message: '排序只能为数字', trigger: 'blur' },
  ],
};

const powerColumns = [
  { title: '权限名字', dataIndex: 'name', key: 'name', width: 120, ellipsis: true },
  { title: '友好名称', dataIndex: 'friendlyName', key: 'friendlyName', width: 150, ellipsis: true },
  { title: '排序', dataIndex: 'sortId', key: 'sortId', width: 80 },
  { title: '权限URL', dataIndex: 'permissionUrl', key: 'permissionUrl', width: 300, ellipsis: true },
  { title: '备注', dataIndex: 'summary', key: 'summary', width: 120 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 150, fixed: 'right' },
];
const renderData = {
  isRequired: false,
  isAuthorize: true,
  isSysModule: false,
  isMenu: true,
  customName: '',
  id: '',
  name: '',
  summary: '',
  permissionUrl: '',
  icon: '',
  sortId: 1,
  identification: '',
  url: '',
  parentId: '',
  resourcesType: 1,
  routerName: '',
};
let formState = reactive(Object.assign({}, renderData));
const formRef = ref(null);
const tabActive = ref('1');
const parentExpandedKeys = ref([]); // 树展开节点
// const iconModal = ref(false);

watch(
  () => formState.parentId,
  () => {
    parentExpandedKeys.value = formState.parentId ? [formState.parentId] : [];
  },
);
// 父-展开树节点
// const parentIdChange = key => {
//   parentExpandedKeys.value = key;
//   console.log(parentExpandedKeys.value)
// };

// 添加或者修改资源信息
const onSaveResourceInfo = () => {
  formRef.value.validate().then(() => {
    if (editStatus.value) {
      postUpdateResourceModule(formState).then(result => {
        if (result.code === 200) {
          message.success('修改成功');
          visible.value = false;
          // getAllTree();
          emit('ok');
        }
      });
    } else {
      // formState.parentId = queryData.parentId;
      postAddResourceModule(formState).then(result => {
        if (result.code === 200) {
          message.success('添加成功');
          visible.value = false;
          emit('ok');
        }
      });
    }
  });
};

// 配置项 - 图标修改
// const onCheckedIcon = icon => {
//   iconModal.value = false;
//   formState.icon = icon;
// };

// tab切换
const onchangeTab = () => {
  if (tabActive.value === '3') {
    fetch();
  }
};

// ---------------------------------模块权限

const powerQueryData = reactive({
  resModuleId: '',
  name: '',
});

// 模块权限 -- 搜索
const onSearchPowerList = () => {
  reloadTable();
};

// 模块权限 -- 新增、修改
const modalPowerAddReff = ref(null);
const dataDetail = ref({});
// 模块权限 -- 新增
const addPermission = () => {
  dataDetail.value = { resModuleId: props.data.id };
  setTimeout(() => {
    modalPowerAddReff.value.visible = true;
  });
};
// 模块权限 -- 修改
const onUpdatePermission = id => {
  postPermissionDetail({ id }).then(result => {
    dataDetail.value = result.data;
    setTimeout(() => {
      modalPowerAddReff.value.visible = true;
    });
  });
};
// 模块权限 -- 新增、修改后操作
const powerOK = () => {
  fetch();
};

// 模块权限 -- 删除
const onDeletePermission = id => {
  Modal.confirm({
    content: '确认要删除该权限吗？',
    icon: () => createVNode(ExclamationCircleOutlined),
    onOk() {
      postDeletePermission({ id }).then(() => {
        message.success('删除成功');
        fetch();
      });
    },
  });
};

watch(
  () => visible.value,
  () => {
    if (visible.value) {
      tabActive.value = '1';
      props.data.id && (powerQueryData.resModuleId = props.data.id);
      Object.assign(formState, props.data);
    } else {
      formRef.value.resetFields();
      Object.keys(renderData).forEach(key => {
        formState[key] = renderData[key];
      });
    }
  },
);

const handleC = () => {
  formState.icon = '';
};

defineExpose({
  visible,
  editStatus,
});
</script>

<style lang="less" scoped>
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
.table-query-tool {
  margin-bottom: 10px;
  display: flex;
  .left-box {
    flex-grow: 1;
  }
}

.select-icon-box {
  width: 32px;
  height: 32px;
  border: dotted 1px @border-color-base;
  border-radius: @border-radius-base;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: @text-color-secondary;

  &:hover {
    border: dotted 1px @primary-color;
    color: @primary-color;
    background-color: fadeout(@primary-color, 95%);
  }

  &.active {
    border: dotted 1px @primary-color;
    color: @primary-color;
    background-color: fadeout(@primary-color, 95%);
  }
}
</style>
