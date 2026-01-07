import { defineComponent, ref, toRefs, watch, computed } from 'vue';
// 组件
import { FormItem, Dropdown, Button } from 'ant-design-vue';
import { FilterOutlined } from '@ant-design/icons-vue';
import Operation from '@/components/BasicTable/src/Operation.vue';
// import SvgIcon from '@/components/SvgIcon/index.vue';

// 组件集合
import { componentMap } from './componentMap';

// 方法
import { isArray, isString, isEmpty } from '@/utils/is';
import { formatToDate } from '@/utils/dateUtil';
import { getSlot } from '@/utils/helper/tsxHelper';
import { upperFirst } from 'lodash-es';
import dayjs from 'dayjs';

function createPlaceholderMessage(component, label) {
  if (component.includes('Input') || component.includes('Complete') || component.includes('Search')) {
    return '请输入' + label;
  }
  if (component.includes('RangePicker')) {
    return ['开始时间', '结束时间'];
  }
  if (component.includes('Picker')) {
    return '请选择日期';
  }
  if (
    component.includes('Select') ||
    component.includes('Cascader') ||
    component.includes('Checkbox') ||
    component.includes('Radio') ||
    component.includes('Switch')
  ) {
    // return `请选择${label}`;
    return '请选择';
  }
  return '';
}

export default defineComponent({
  props: {
    formModel: {
      type: Object,
      default: () => {
        return {};
      },
    },
    formRef: {
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
    slots: {
      type: [Object, Array],
      default: undefined,
    },
    defaultSlots: {
      type: [Array, Object],
      default: undefined,
    },
    btnSlot: {
      type: Array,
      default: undefined,
    },
    spanSize: {
      type: Object,
      default: () => {
        return {};
      },
    },
    showCount: {
      type: Number,
      default: 0,
    },
    mode: {
      type: String,
      default: 'card',
    },
    showMode: {
      type: Boolean,
      default: false,
    },
    formItemProps: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ['submit', 'reset', 'refresh', 'changeMode'],
  setup(props, { emit }) {
    const { defaultSlots, formItemProps, spanSize, formModel, options, slots, btnSlot, showCount, showMode, mode } = toRefs(props);

    let data = JSON.parse(JSON.stringify(formModel.value));

    // 渲染组件
    function renderComponent(schema) {
      const { component, field, changeEvent = 'change', valueField, componentProps, fieldToTime, label } = schema;

      const isCheck = component && ['Switch', 'Checkbox'].includes(component);

      const eventKey = `on${upperFirst(changeEvent)}`;

      const on = {
        [eventKey]: (...args) => {
          const [e] = args;
          if (propsData[eventKey]) {
            propsData[eventKey](...args);
          }
          const target = e ? e.target : null;
          let value = target ? (isCheck ? target.checked : target.value) : e;

          // 如果是数组，是时间范围，对时间的值格式化处理
          if (isArray(value) && value[0] && value[1] && fieldToTime) {
            let [[startTimeKey, endTimeKey], format] = fieldToTime;
            formModel.value[startTimeKey] = formatToDate(value[0], format);
            // 为了兼容后端，结束日期加1天
            formModel.value[endTimeKey] = formatToDate(dayjs(value[1]).add(1, 'day').format('YYYY-MM-DD'), format);
          }
          if (fieldToTime && isEmpty(value)) {
            let [[startTimeKey, endTimeKey]] = fieldToTime;
            formModel.value[startTimeKey] = undefined;
            formModel.value[endTimeKey] = undefined;
          }
          // 移除空格
          if (isString(value)) {
            value = value.trim();
          }
          formModel.value[field] = value;
          nextTick(() => {
            onSubmit(); // 实时查询
          });
        },
      };
      const Comp = componentMap.get(component);
      const propsData = {
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        maxlength: 30,
        allowClear: true,
        placeholder: createPlaceholderMessage(component, label),
        ...componentProps,
        getPopupContainer: trigger => trigger.parentNode,
      };

      const bindValue = {
        [valueField || (isCheck ? 'checked' : 'value')]: formModel.value[field],
      };

      const compAttr = {
        ...propsData,
        ...on,
        ...bindValue,
      };
      return (
        <div>
          <Comp {...compAttr} />
        </div>
      );
    }

    // 渲染表单FormItem
    function renderItem(schema) {
      let { itemProps, slot, field, label, component, labelWidth } = schema;
      if (!labelWidth) {
        labelWidth = 90;
      }

      // 插槽-->component类型显示
      const getContent = () => {
        return slot ? getSlot(slots.value, slot, { field }) : renderComponent(schema);
      };
      // const isInput = ['Input', 'DatePicker', 'Search'].includes(component);
      const itemClass = {
        // 'input-warp': isInput,
        // 'select-warp': ['Select', 'RangePicker'].includes(component),
        'select-warp': ['Select', 'TreeSelect'].includes(component),
      };
      return (
        <FormItem
          name={field}
          {...itemProps}
          style={{ '--labelWidth': labelWidth + 'px' }}
          class={itemClass}
          label={label}
        >
          {getContent()}
        </FormItem>
      );
    }

    function domRender() {
      const dom = defaultSlots.value.map(item => {
        Object.assign(item.props || {}, formItemProps.value);
        // 如果 formItem 自己配置了 hidden，默认使用它自己的
        const colSize = item ? Number(item?.props?.['col-size']) ?? 1 : 1;
        const colSpan = Math.min(spanSize.value.span * (colSize || 1), 24);

        return {
          itemDom: item,
          colSpan,
          hidden: false,
        };
      });

      return dom;
    }

    function optionRender() {
      const dom = options.value.map(item => {
        Object.assign(item.props || {}, formItemProps.value);
        // 如果 formItem 自己配置了 hidden，默认使用它自己的
        const colSize = item ? Number(item?.['col-size']) ?? 1 : 1;
        const colSpan = Math.min(spanSize.value.span * (colSize || 1), 24);

        return {
          itemDom: item,
          colSpan,
          hidden: false,
        };
      });

      return dom;
    }

    // 重置
    function resetForm() {
      Object.keys(formModel.value).forEach(key => {
        formModel.value[key] = undefined;
      });
      Object.assign(formModel.value, data);
      emit('reset');
    }

    // 提交
    function onSubmit() {
      emit('submit');
    }

    let doms = ref(null);

    const searchList = computed(() => {
      return (doms.value || []).reduce(
        (pre, item) => {
          if (pre.searchList.length < showCount.value) {
            pre.searchList.push(item);
          } else {
            pre.moreList.push(item);
          }

          return pre;
        },
        {
          searchList: [],
          moreList: [],
        },
      );
    });


    watch(
      () => [spanSize, options],
      () => {
        if (options.value && options.value.length) {
          doms.value = optionRender();
        } else {
          doms.value = domRender();
        }
      },
      { deep: true, immediate: true },
    );
    // watch(()=>formModel.value,()=>{
    //   con
    // })

    const filterNum = computed(() => {
      return searchList.value.moreList.reduce((pre, item) => {
        if (
          formModel.value[item.itemDom.field] !== data[item.itemDom.field] &&
          !isEmpty(formModel.value[item.itemDom.field])
        ) {
          pre++;
        }

        return pre;
      }, 0);
    });

    let dropdownVisible = ref(false);

    return () => {
      function getMoreDoms() {
        let content = (
          <div class="dropdown-warp">
            {getContentDoms(searchList.value.moreList)}
            <div class="reset-btn-warp">
              <Button onClick={resetForm}>重置</Button>
            </div>
          </div>
        );
        return searchList.value.moreList.length ? (
          <div class="d-flex mr-16">
            <Dropdown
              v-model={[dropdownVisible.value, 'visible']}
              placement="bottomLeft"
              overlay={content}
              trigger="click"
            >
              <div class={`flex-between more-warp ${filterNum.value !== 0 ? 'more-warp-active' : ''}`}>
                <div style="width:85px">
                  更多筛选{filterNum.value !== 0 ? <div class="filter-num">{filterNum.value}</div> : ''}
                </div>
                <FilterOutlined />
              </div>
            </Dropdown>
          </div>
        ) : (
          ''
        );
      }

      const getContentDoms = searchList => {
        return (searchList || []).reduce((pre, itemProps, index) => {
          const { itemDom } = itemProps;
          const itemKey = itemDom?.key || itemDom?.props?.label || index;

          pre.push(<div key={itemKey}>{options.value && options.value.length ? renderItem(itemDom) : itemDom}</div>);

          return pre;
        }, []);
      };

      const getResetText = computed(() => {
        return Object.values(formModel.value).some(item => {
          // debugger
          return !!item || item === 0;
        });
      });

      const refresh = () => {
        emit('refresh');
      }

      const changeMode = (mode) => {
        emit('changeMode', mode);
      }

      return (
        <div class="d-flex ">
          <div class="flex-1 d-flex flex-wrap pr4">
            {getContentDoms(searchList.value.searchList)}
            {getMoreDoms()}
            {getResetText.value ? (
              <Span style="height: 36px;cursor: pointer;" class="d-flex a-center" onClick={resetForm}>
                重置筛选
              </Span>
            ) : (
              ''
            )}
            {/* {
              <Button style="height: 36px; border-radius: 4px;" class="mb-16" type="primary" onClick={onSubmit}>
                查询
              </Button>
            } */}
          </div>
          <div>
            {(btnSlot.value || <Operation show-mode={showMode.value} mode={mode.value} onChangeMode={changeMode} onRefresh={refresh}></Operation>)}
            <Button style="display:none" htmlType="submit" type="primary"></Button>
          </div>
        </div>
      );
    };
  },
});
