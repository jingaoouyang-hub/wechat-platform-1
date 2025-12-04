<template>
  <a-drawer
    :mask-closable="true"
    :destroy-on-close="true"
    :width="900"
    @close="closeHandle"
    v-bind="{ ...$props, ...$attrs }"
  >
    <slot></slot>
    <div v-if="footer !== null" style="height: 56px">
      <div class="basic-drawer-footer">
        <slot name="footer">
          <div>
            <a-space>
              <a-button @click="closeHandle">取消</a-button>
              <a-button type="primary" @click="ok">确定</a-button>
            </a-space>
          </div>
        </slot>
      </div>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
const emits = defineEmits(['ok', 'cancel']);
defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  footer: {
    type: String,
    default: undefined,
  },
});

const closeHandle = () => {
  emits('cancel');
};

const ok = () => {
  emits('ok');
};
</script>
<style lang="less">
.drawerClassName {
  .ant-drawer-content {
    overflow: hidden;
  }
}
</style>

<style scoped lang="less">
.title {
  font-weight: 600;
  font-size: 20px;
}

.drawerClassName {
  .ant-drawer-content {
    overflow: hidden;
  }
}

:deep(.ant-drawer-content) {
  overflow: hidden;
}
.basic-drawer-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e4e8ef;
  padding: 12px 24px;
  background: #fff;
  text-align: right;
  z-index: 1;
}
</style>
