import './index.less';
import QueryFilterContent from './QueryFilterContent.jsx';
import { defineComponent, ref, computed, toRefs } from 'vue';
import { onMountedOrActivated } from '@/hooks/event/onMountedOrActivated';

import { Form } from 'ant-design-vue';
// Card

import { throttle } from 'lodash-es';

const CONFIG_COUNT = [
  { minWidth: 815, showCount: 1 },
  { minWidth: 1070, showCount: 2 },
  { minWidth: Infinity, showCount: 3 },
];

export default defineComponent({
  props: {
    formModel: {
      // 表单数据
      type: Object,
      default: () => {
        return {};
      },
    },
    options: {
      type: Array,
      default: () => {
        return [];
      },
    },
    layout: {
      type: String,
      default: 'default',
    },
    labelWidth: {
      type: Number,
      default: null,
    },
    span: {
      type: Number,
      default: 0,
    },
    showMode: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: 'table',
    },
  },
  emits: ['changeMode', 'refresh', 'reset', 'submit'],
  setup(props, { slots, emit }) {
    const { formModel, options, mode, showMode } = toRefs(props);

    let defaultSlots = computed(() => {
      return slots
        .default?.()
        .filter(item => !['Symbol(Comment)', 'Symbol(Text)', 'Symbol()'].includes(item.type.toString()));
    });
    let btnSlot = slots.btn?.();
    let containRef = ref(null);
    let formRef = ref(null);

    let containWidth = ref(0);
    const update = () => {
      containWidth.value = containRef.value?.clientWidth;
    };

    const showCount = computed(() => {
      const breakPoint = CONFIG_COUNT.find(item => {
        return containWidth.value < item.minWidth;
      });
      return breakPoint.showCount;
    });
    addEventListener('resize', update);
    onMountedOrActivated(() => {
      containWidth.value = containRef.value?.clientWidth;
    });

    // 重置
    function resetForm() {
      emit('reset');
    }

    // 提交

    const onSubmit = throttle(
      () => {
        emit('submit');
      },
      300,
      {
        leading: true,
      },
    );

    function refresh() {
      emit('refresh');
    }

    function changeMode(mode) {
      emit('changeMode', mode);
    }
    return () => {
      return (
        <div class="query-form" ref={containRef}>
          <Form layout="horizontal" onSubmit={onSubmit} model={formModel.value} ref={formRef}>
            <QueryFilterContent
              onSubmit={onSubmit}
              defaultSlots={defaultSlots}
              options={options.value}
              showCount={showCount.value}
              slots={slots}
              btnSlot={btnSlot}
              formRef={formRef.value}
              formModel={formModel.value}
              showMode={showMode.value}
              mode={mode.value}
              onReset={resetForm}
              onChangeMode={changeMode}
              onRefresh={refresh}
            ></QueryFilterContent>
          </Form>
        </div>
      );
    };
  },
});
