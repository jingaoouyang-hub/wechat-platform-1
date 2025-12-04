<template>
  <BasicDrawer v-model:visible="visible" title="选择素材" :width="620" @ok="handleOk" @cancel="handleCancel">
    <a-row class="item-list" :gutter="[24, 24]">
      <a-col class="box-item" v-for="item in dataSource" :key="item.id" :span="6">
        <a-checkbox
          class="item-checkbox"
          :checked="selectedRowKeys.includes(item.id)"
          :value="item.id"
          @change="changeChecked"
        />
        <a-image class="item-image" :src="item.picUrl" :width="120" referrerPolicy="no-referrer" />
      </a-col>
    </a-row>
    <a-pagination
      v-model:current="queryData.current"
      v-model:pageSize="queryData.size"
      :total="total"
      :pageSizeOptions="['12', '24', '36', '48']"
      @change="changePageSize"
    />
  </BasicDrawer>
</template>

<script setup>
import { postMaterialList } from '@/api/wechat-manage/material';
import { message } from 'ant-design-vue';

const accountId = inject('accountId');

const queryData = reactive({
  type: '',
  materialType: '',
  size: 12,
  current: 1,
});

const dataSource = ref([]);
const selectedRowKeys = ref([]);
const total = ref(0);

const emit = defineEmits(['change']);
const visible = ref(false);

const handleOk = () => {
  if (selectedRowKeys.value.length === 0) {
    message.error('请选择素材');
    return;
  }
  emit('change', selectedRowKeys.value);
  handleCancel();
};

const showModal = data => {
  visible.value = true;
  nextTick(() => {
    queryData.type = data.type;
    queryData.materialType = data.materialType;
    selectedRowKeys.value = data.picIds || [];
    getList();
  });
};

const getList = () => {
  postMaterialList({ ...queryData, accountId: accountId.value }).then(res => {
    dataSource.value = res.data.records;
    total.value = res.data.total;
  });
};

const changeChecked = e => {
  if (e.target.checked) {
    selectedRowKeys.value.push(e.target.value);
  } else {
    selectedRowKeys.value = selectedRowKeys.value.filter(item => item !== e.target.value);
  }
};

const changePageSize = size => {
  queryData.current = size;
  getList();
};

const handleCancel = () => {
  visible.value = false;
  selectedRowKeys.value = [];
};

defineExpose({
  showModal,
  visible,
});
</script>

<style scoped lang="less">
.item-list {
  margin-bottom: 24px;
}
.box-item {
  position: relative;
  .item-checkbox {
    position: absolute;
    top: 0;
    left: 12px;
    z-index: 99;
  }
}
</style>
