<!-- //省市区组件 -->
<template>
  <a-cascader
    v-model:value="dataValue"
    :options="options"
    :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
    :load-data="loadData"
    placeholder="请选择"
    change-on-select
  />
</template>

<script setup name="RegionCascader">
import { regionChildren } from '@/api/common';
import { useVModel } from '@vueuse/core';
const emit = defineEmits(['update:value']);
const props = defineProps({
  value: {
    type: [String, Array],
    default: undefined,
  },
  // level: { 展示的等级从0开始
  //   type: [String, Number],
  //   default: 2,
  // },
});

const dataValue = useVModel(props, 'value', emit);

// 懒加载回调方法
const loadData = selectedOptions => {
  const targetOption = selectedOptions[selectedOptions.length - 1];
  targetOption.loading = true; // load options lazily
  if (!targetOption.children || !targetOption.children.length) {
    regionChildren({ parentId: targetOption.id, status: 1, pinyinSort: false }).then(res => {
      targetOption.children = res.data.map(item => {
        item.isLeaf = item.childrenCount == 0;
        return { ...item, isLeaf: item.childrenCount == 0 };
      });
      options.value = [...options.value];
    });
  }
};

let options = ref([]);

// 获取options的值
const getOption = async (values = [], options = [], level = 0) => {
  let preValue = values[level - 1];
  let curValue = values[level];
  let res = await regionChildren({ parentId: preValue, status: 1, pinyinSort: false });
  let findItem = null;
  let areaList = res.data.map(item => {
    if (item.id === curValue) {
      findItem = item;
    }
    item.isLeaf = item.childrenCount == 0;
    item.level = level;
    return item;
  });
  options.push(...areaList);
  // 跳出递归
  if (findItem && level < values.length - 1) {
    findItem.children = [];
    level++;
    await getOption(values, findItem.children, level);
  }
  return options;
};

const initOption = () => {
  getOption(props.value).then(data => {
    console.log(data);
    options.value = data;
  });
};

onMounted(() => {
  initOption();
});

defineExpose({
  initOption,
});
</script>

<style scoped lang="less"></style>
