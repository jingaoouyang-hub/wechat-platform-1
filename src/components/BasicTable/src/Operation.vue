<template>
  <div class="action-warp d-flex">
    <template v-if="showMode">
      <div class="action-item flex-center" :class="{ active: mode === 'table' }" @click="changeMode('table')">
        <insert-row-above-outlined />
        表格
      </div>
      <div class="action-item flex-center" :class="{ active: mode !== 'table' }" @click="changeMode('card')">
        <bars-outlined />
        列表
      </div>
    </template>
    <div class="action-item flex-center" @click="refresh">
      <reload-outlined />
      刷新
    </div>
  </div>
</template>

<script setup name="Operation">
defineProps({
  mode: {
    type: String,
    default: 'card',
  },
  showMode: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(['changeMode', 'refresh']);

function refresh() {
  emits('refresh');
}

function changeMode(mode) {
  emits('changeMode', mode);
}
</script>

<style lang="less" scoped>
.action-warp {
  .action-item {
    padding: 9px 10px;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
    white-space: nowrap;
    // border: 1px solid transparent;
    &:hover {
      color: @primary-color;
    }
    // &:active{
    //   border: 1px solid @main-color;
    //   background:rgba(233, 240, 249, 0.85);
    // }
    &.active {
      background: rgba(233, 240, 249, 0.85);
    }
    & + .action-item {
      margin-left: 12px;
    }
    .anticon {
      margin-right: 6px;
    }
  }
}
</style>
