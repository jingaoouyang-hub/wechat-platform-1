<template>
  <component :is="name" v-if="isAntIcon" />
  <svg v-else class="c-icon icon" aria-hidden="true">
    <use :xlink:href="`#${name}`"></use>
  </svg>
</template>

<script lang="ts">
import { computed, PropType, defineComponent } from 'vue';
import './icon/iconfont.js';
import { antIconNames } from '@/plugins/icon';

export default defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String as PropType<string>,
      default: '',
    },
  },
  setup(props) {
    const isAntIcon = computed(() => {
      return antIconNames().includes(props.name ?? '');
    });

    return {
      isAntIcon,
    };
  },
});
</script>

<style scoped lang="less">
@import url('./icon/iconfont.css');

.icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentcolor;
}
</style>
