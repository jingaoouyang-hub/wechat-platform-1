<template>
  <div ref="scaleBoxRef" class="scale-box">
    <div ref="scaleContentRef" class="scale-content" :style="{ width: size[0] + 'px', height: size[1] + 'px' }">
      <slot />
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, onMounted, onUnmounted, ref, toRefs, watch } from 'vue';
export default defineComponent({
  name: 'scaleBoxIndex',
  props: {
    size: {
      type: Array,
      default: () => [795, 630], // 传入实际宽高
    },
  },
  setup(props) {
    const scaleBoxRef = ref();
    const scaleContentRef = ref();

    // * 默认缩放值
    let scale = '1';
    // * 设计稿尺寸（px）
    const baseWidth = 1920;
    const baseHeight = 1080;
    // * 需保持的比例（默认1.77778）
    const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5));

    const handleResize = () => {
      if (!scaleBoxRef.value || !scaleContentRef.value) {
        return;
      }
      // 当前宽高比
      const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5));
      if (currentRate > baseProportion) {
        // 表示更宽
        scale = window.innerHeight / baseHeight;
        // 给容器高赋值真实高度，解决高度在flex布局高度自动撑开的bug
        scaleBoxRef.value.style.height = (props.size[1] * scale).toFixed(5) + 'px';
        scaleContentRef.value.style.transform = `scale(${scale}) translate(-50%, -50%)`;
      } else {
        // 表示更高
        scale = window.innerWidth / baseWidth;
        // 给容器高赋值真实高度，解决高度在flex布局高度自动撑开的bug
        scaleBoxRef.value.style.height = (props.size[1] * scale).toFixed(5) + 'px';
        scaleContentRef.value.style.transform = `scale(${scale}) translate(-50%, -50%)`;
      }
    };

    watch(
      () => props.size,
      () => {
        nextTick(() => {
          handleResize();
        });
      },
      {
        deep: true,
      },
    );

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    onMounted(() => {
      handleResize();

      window.addEventListener('resize', handleResize);

      const ro = new ResizeObserver(() => {
        handleResize();
      });

      // 观察一个或多个元素
      ro.observe(scaleBoxRef.value);
    });

    return {
      ...toRefs(props),
      scaleBoxRef,
      scaleContentRef,
    };
  },
});
</script>

<style scoped lang="less">
.scale-box {
  width: 100%;
  position: relative;
  transform-origin: 0 0;
}
.scale-content {
  transform-origin: 0 0;
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>
