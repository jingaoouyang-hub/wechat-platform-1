<template>
  <a-card class="catalogue-box">
    <template #title>
      <div class="flex-between">
        <div>组织架构</div>
        <PlusCircleOutlined v-power="['add']" class="add-icon" @click="addDepart({})" />
      </div>
    </template>

    <a-input-search class="input-box" v-model:value="keyword" placeholder="请输入" />
    <div class="tree-box">
      <a-tree
        v-model:expandedKeys="expandedKeys"
        :selected-keys="selectedKeys"
        :tree-data="treeData"
        :field-names="{ children: 'children', title: 'name', key: 'id' }"
        :auto-expand-parent="autoExpandParent"
        v-bind="{ ...$attrs }"
        @expand="onExpand"
        @select="onSelect"
      >
        <template #title="record">
          <template v-if="record.name.length >= 8">
            <span class="tree-title">
              <a-tooltip>
                <template #title>{{ record.name }}</template>
                <span v-if="likeIncludes(record.name, keyword) > -1">
                  {{ record.name.substr(0, likeIncludes(record.name, keyword)) }}
                  <span class="text-primary">
                    {{
                      record.name.substr(
                        likeIncludes(record.name, keyword),
                        likeIncludes(record.name, keyword) + keyword.length,
                      )
                    }}
                  </span>
                  {{ record.name.substr(likeIncludes(record.name, keyword) + keyword.length) }}
                </span>
                <span v-else>{{ record.name }}</span>
              </a-tooltip>
            </span>
          </template>
          <template v-else>
            <span v-if="likeIncludes(record.name, keyword) > -1">
              {{ record.name.substr(0, likeIncludes(record.name, keyword)) }}
              <span class="text-primary">
                {{
                  record.name.substr(
                    likeIncludes(record.name, keyword),
                    likeIncludes(record.name, keyword) + keyword.length,
                  )
                }}
              </span>
              {{ record.name.substr(likeIncludes(record.name, keyword) + keyword.length) }}
            </span>
            <span v-else>{{ record.name }}</span>
          </template>
          <EditOutlined class="edit-icon" @click.stop="addDepart(record)" />
          <DeleteOutlined class="edit-icon" @click.stop="delDepart(record.id)" />
        </template>
      </a-tree>
    </div>
  </a-card>

  <a-modal
    v-model:visible="departModal"
    :title="formState.id ? '修改组织' : '添加组织'"
    :width="700"
    @ok="onSaveDepartForm"
  >
    <a-form layout="vertical" :colon="false" ref="formRef" :model="formState" :rules="rules">
      <a-form-item label="上级组织">
        <a-tree-select
          v-model:value="formState.parentId"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择"
          allow-clear
          :field-names="{ children: 'children', label: 'name', value: 'id' }"
          tree-default-expand-all
          :tree-data="treeData"
        ></a-tree-select>
      </a-form-item>
      <a-form-item label="组织名称" required name="name">
        <a-input v-model:value="formState.name" placeholder="请输入" show-count :maxlength="30"></a-input>
      </a-form-item>
      <a-form-item label="组织负责人" name="principalId">
        <a-select
          v-model:value="formState.principalId"
          show-search
          allow-clear
          placeholder="请搜索负责人名称（默认显示前10名用户）"
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
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup name="building-sider">
import { createVNode } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { PlusCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';

import { postDepartmentAdd, postDepartmentDelete, postDepartmentUpdate } from '@/api/system/departmentApi';
import { useSearchUser } from '@/hooks/useSearchUser';

// 搜索用户相关
let { searchUserList, searchUserLoading, handleSearchUser, getSearchUserList, setDefaultSearchUserList } =
  useSearchUser();
// 搜索用户相关 end

const props = defineProps({
  treeData: {
    type: Array,
    required: true,
    default: () => [],
  },
  selectedKeys: {
    type: Array,
    required: true,
    default: () => [],
  },
  selectedItem: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const emits = defineEmits(['update:selectedKeys', 'updateDepartTree', 'update:selectedItem']);

const departModal = ref(false);
const formRef = ref(null);
// 不为空，则为新增二级组织
const formState = reactive({
  id: null,
  name: '',
  sortId: 0,
  parentId: null,
  principalId: undefined,
});

watch(
  () => departModal.value,
  () => {
    if (!departModal.value) {
      nextTick(() => {
        formRef.value.resetFields();
      });
    }
  },
);

const rules = {
  name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
};

const addDepart = async (record = {}) => {
  formState.id = record.id;
  formState.name = record.name;
  formState.parentId = record.parentId === '0' ? null : record.parentId;
  formState.principalId = record.principalId;
  await getSearchUserList();
  departModal.value = true;
  if (!formState.principalId) {
    return;
  }
  setDefaultSearchUserList(formState.principalId);
};
const delDepart = id => {
  Modal.confirm({
    content: '确认删除吗?',
    icon: () => createVNode(ExclamationCircleOutlined),
    onOk() {
      postDepartmentDelete({ id }).then(() => {
        emits('updateDepartTree', []);
        if (id === props.selectedKeys[0]) {
          emits('update:selectedKeys', []);
        }
        message.success('删除成功');
      });
    },
  });
};

// 添加组织
const onSaveDepartForm = () => {
  formRef.value.validate().then(() => {
    let fetchConfirm = formState.id ? postDepartmentUpdate : postDepartmentAdd;
    let params = { ...formState };
    params.parentId = params.parentId || '0';
    params.principalId = params.principalId || null;
    fetchConfirm(params).then(result => {
      if (result.code === 200) {
        message.success('操作成功');
        departModal.value = false;
        emits('updateDepartTree', []);
      }
    });
  });
};

const keyword = ref('');
const autoExpandParent = ref(true);
const expandedKeys = ref([]);
let currentDataArray = [];
let keyList = [];

// 获取所有key
const getAllKeyList = data => {
  let arr = [];
  for (let item of data) {
    const { id, name } = item;
    arr.push({
      key: id,
      title: name,
    });
    if (item.children) {
      arr = arr.concat(getAllKeyList(item.children));
    }
  }
  return arr;
};
watch(
  () => props.treeData,
  () => {
    if (props.treeData.length) {
      keyList = getAllKeyList(props.treeData);
    }
  },
);
watch(keyword, () => {
  keyword.value && handleExpandKeysForTitle();
});
watch(props.selectedKeys, () => {
  currentDataArray = handlecurrentDataArray(props.treeData, props.selectedKeys[0]);
  keyword.value = '';
  setTimeout(() => {
    handleExpandKeys();
  }, 0);
});
// 根据key获取嵌套路径信息
const handlecurrentDataArray = (sourceData, key) => {
  if (!sourceData || sourceData.length === 0) {
    return [];
  }
  let array = [];
  for (let item of sourceData) {
    const filterArray = handlecurrentDataArray(item.children, key);
    if (filterArray.length || item.id === key) {
      array = [
        {
          title: item.name,
          key: item.id,
        },
        ...filterArray,
      ];
    }
  }
  return array;
};
// 选中的展开
const handleExpandKeys = () => {
  const expandeds = currentDataArray.map(item => item.key).filter(key => !expandedKeys.value.includes(key));
  expandedKeys.value = expandedKeys.value.concat(expandeds);
};
// 获取父节点key(搜索自动展开)
const getParentId = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.id === key)) {
        parentKey = node.id;
      } else if (getParentId(key, node.children)) {
        parentKey = getParentId(key, node.children);
      }
    }
  }
  return parentKey;
};
const onExpand = keys => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
};

const onSelect = (keys, { node }) => {
  emits('update:selectedKeys', keys);
  emits('update:selectedItem', node.dataRef);
};
const likeIncludes = (text1, text2) => {
  return text1?.toLowerCase().indexOf(text2?.toLowerCase());
};

// 按标题展开
const handleExpandKeysForTitle = () => {
  const expandeds = keyList
    .filter(item => likeIncludes(item.title, keyword.value) > -1)
    .map(item => getParentId(item.key, props.treeData));
  expandedKeys.value = expandeds;
  autoExpandParent.value = true;
};
</script>

<style scoped lang="less">
.catalogue-box {
  height: 100%;
  width: 270px;

  .add-icon {
    font-size: 18px;

    &:hover {
      color: @primary-color;
    }
  }

  ::v-deep(.ant-card-body) {
    padding: 0;
    height: calc(100% - 58px);

    .input-box {
      padding: 24px;
    }

    .tree-box {
      width: 268px;
      height: calc(100% - 80px);
      padding: 0 24px;
      overflow-y: auto;
      overflow-x: auto;

      .edit-icon {
        margin-left: 10px;
        display: none;
        &:hover {
          color: @primary-color;
        }
      }

      .ant-tree {
        .ant-tree-node-content-wrapper {
          max-width: 190px;

          &:hover {
            .edit-icon {
              display: inline-block;
            }
          }

          .ant-tree-title {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }

          .tree-title {
            display: inline-block;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
