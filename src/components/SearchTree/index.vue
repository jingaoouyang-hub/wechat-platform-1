<template>
  <div>
    <a-input v-model:value="keyword" style="margin-bottom: 8px" placeholder="请输入" />
    <a-tree
      v-model:expandedKeys="expandedKeys"
      :tree-data="treeData"
      :field-names="{ children: 'children', title: 'name', key: 'id' }"
      :auto-expand-parent="autoExpandParent"
      @expand="onExpand"
      blockNode
      v-bind="{ ...$attrs, ...$props }"
    >
      <template #title="record">
        <slot name="title" :record="record" :title="record.name" :keyword="keyword" v-bind="{ ...substrData(record) }">
          <component :is="getTitleDafalutHtml(record)"></component>
        </slot>
      </template>
    </a-tree>
  </div>
</template>

<script setup name="SearchTree" lang="jsx">
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
});
const keyword = ref('');
const autoExpandParent = ref(true);
const expandedKeys = ref([]);
let currentDataArray = [];
let keyList = [];
const substrData = record => {
  let prefixWord = '';
  let searchWord = '';
  let suffixWord = '';
  let likeIndex = likeIncludes(record.name, keyword.value);
  if (likeIndex > -1) {
    prefixWord = record.name.substr(0, likeIndex);
    searchWord = record.name.substr(likeIndex, keyword.value.length);
    suffixWord = record.name.substr(likeIndex + keyword.value.length);
  } else {
    searchWord = record.name;
  }

  return {
    prefixWord,
    searchWord,
    suffixWord,
    likeIndex,
    name: record.name,
  };
};

const getTitleDafalutHtml = record => {
  let { prefixWord, searchWord, suffixWord, likeIndex, name } = substrData(record);
  return likeIndex > -1 ? (
    <span title={name}>
      {prefixWord}
      <span class="text-danger">{searchWord}</span>
      {suffixWord}
    </span>
  ) : (
    <span title={name}>{record.name}</span>
  );
};

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
:deep(.ant-tree) {
  .ant-tree-treenode {
    height: 32px;
    display: flex;
    align-items: center;
    padding-bottom: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.ant-tree-treenode-selected {
      background-color: rgba(26, 144, 255, 0.05);
      .ant-tree-node-content-wrapper.ant-tree-node-selected {
        background-color: transparent;
      }
      .ant-tree-title {
        color: @primary-color;
      }
      .ant-tree-switcher-icon {
        color: rgba(26, 144, 255, 0.45);
      }
    }
    .ant-tree-switcher {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ant-tree-node-content-wrapper {
      background-color: transparent;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
