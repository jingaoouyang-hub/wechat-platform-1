<script lang="jsx">
import { computed, defineComponent, toRefs, unref } from 'vue';
// import { BasicHelp } from '/@/components/Basic';
import { isBoolean, isFunction, isNull } from '@/utils/is';
import { getSlot } from '@/utils/helper/tsxHelper';
import { createPlaceholderMessage, setComponentRuleType } from '../helper';
import { cloneDeep, upperFirst } from 'lodash-es';
import { useItemLabelWidth } from '../hooks/useLabelWidth';
// 组件
import { Col, Divider, Form } from 'ant-design-vue';
import { componentMap } from '../componentMap';

export default defineComponent({
  name: 'BasicFormItem',
  inheritAttrs: false,
  props: {
    schema: {
      type: Object,
      default: () => ({}),
    },
    formProps: {
      type: Object,
      default: () => ({}),
    },
    allDefaultValues: {
      type: Object,
      default: () => ({}),
    },
    formModel: {
      type: Object,
      default: () => ({}),
    },
    setFormModel: {
      type: Function,
      default: null,
    },
    formActionType: {
      type: Object,
    },
  },
  setup(props, { slots }) {
    const { schema, formProps } = toRefs(props);

    const itemLabelWidthProp = useItemLabelWidth(schema, formProps);

    // 获取当前组件的values
    const getValues = computed(() => {
      const { allDefaultValues, formModel, schema } = props;
      const { mergeDynamicData } = props.formProps;
      return {
        field: schema.field,
        model: formModel,
        values: {
          ...mergeDynamicData,
          ...allDefaultValues,
          ...formModel,
        },
        schema: schema,
      };
    });

    // 获取所有组件的Props
    const getComponentsProps = computed(() => {
      const { schema, formModel, formActionType } = props;
      let { componentProps = {} } = schema;
      if (isFunction(componentProps)) {
        componentProps = componentProps({ schema, formModel, formActionType }) ?? {};
      }
      if (schema.component === 'Divider') {
        componentProps = Object.assign({ type: 'horizontal' }, componentProps, {
          orientation: 'left',
          plain: true,
        });
      }
      return componentProps;
    });

    // 判断改组件是否禁用
    const getDisable = computed(() => {
      const { disabled: globDisabled } = props.formProps;
      const { dynamicDisabled } = props.schema;
      const { disabled: itemDisabled = false } = unref(getComponentsProps);
      let disabled = !!globDisabled || itemDisabled;
      // 动态判断当前组件是否禁用
      if (isBoolean(dynamicDisabled)) {
        disabled = dynamicDisabled;
      }
      if (isFunction(dynamicDisabled)) {
        disabled = dynamicDisabled(unref(getValues));
      }
      return disabled;
    });

    // show ifShow 判断是否显示
    function getShow() {
      const { show, ifShow } = props.schema;

      let isShow = true;
      let isIfShow = true;

      if (isBoolean(show)) {
        isShow = show;
      }
      if (isBoolean(ifShow)) {
        isIfShow = ifShow;
      }
      if (isFunction(show)) {
        isShow = show(unref(getValues));
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(unref(getValues));
      }
      return { isShow, isIfShow };
    }

    // 表单校验规则处理
    function handleRules() {
      const { rules: defRules = [], component, dynamicRules, required, label } = props.schema;

      if (isFunction(dynamicRules)) {
        return dynamicRules(unref(getValues));
      }

      let rules = cloneDeep(defRules);
      const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } = props.formProps;

      const joinLabel = Reflect.has(props.schema, 'rulesMessageJoinLabel')
        ? rulesMessageJoinLabel
        : globalRulesMessageJoinLabel;
      const defaultMsg = createPlaceholderMessage(component) + `${joinLabel ? label : ''}`;

      function validator(rule, value) {
        const msg = rule.message || defaultMsg;
        if (value === undefined || isNull(value)) {
          // 空值
          return Promise.reject(msg);
        } else if (Array.isArray(value) && value.length === 0) {
          // 数组类型
          return Promise.reject(msg);
        } else if (typeof value === 'string' && value.trim() === '') {
          // 空字符串
          return Promise.reject(msg);
        } else if (
          typeof value === 'object' &&
          Reflect.has(value, 'checked') &&
          Reflect.has(value, 'halfChecked') &&
          Array.isArray(value.checked) &&
          Array.isArray(value.halfChecked) &&
          value.checked.length === 0 &&
          value.halfChecked.length === 0
        ) {
          // 非关联选择的tree组件
          return Promise.reject(msg);
        }
        return Promise.resolve();
      }

      const getRequired = isFunction(required) ? required(unref(getValues)) : required;

      /*
       * 1、若设置了required属性，又没有其他的rules，就创建一个验证规则；
       * 2、若设置了required属性，又存在其他的rules，则只rules中不存在required属性时，才添加验证required的规则
       *     也就是说rules中的required，优先级大于required
       */
      if (getRequired) {
        if (!rules || rules.length === 0) {
          rules = [{ required: getRequired, validator }];
        } else {
          const requiredIndex = rules.findIndex(rule => Reflect.has(rule, 'required'));

          if (requiredIndex === -1) {
            rules.push({ required: getRequired, validator });
          }
        }
      }

      const requiredRuleIndex = rules.findIndex(
        rule => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator'),
      );

      if (requiredRuleIndex !== -1) {
        const rule = rules[requiredRuleIndex];
        const { isShow } = getShow();
        if (!isShow) {
          rule.required = false;
        }
        if (component) {
          if (!Reflect.has(rule, 'type')) {
            rule.type = component === 'InputNumber' ? 'number' : 'string';
          }

          if (component.includes('Input') || component.includes('Textarea')) {
            rule.whitespace = true;
          }
          const valueFormat = unref(getComponentsProps)?.valueFormat;
          setComponentRuleType(rule, component, valueFormat);
        }
      }

      // Maximum input length rule check
      const characterInx = rules.findIndex(val => val.max);
      if (characterInx !== -1 && !rules[characterInx].validator) {
        rules[characterInx].message = rules[characterInx].message || [rules[characterInx].max];
      }
      return rules;
    }

    // 渲染组件
    function renderComponent() {
      const { renderComponentContent, component, field, changeEvent = 'change', valueField } = props.schema;

      const isCheck = component && ['Switch', 'Checkbox'].includes(component);

      const eventKey = `on${upperFirst(changeEvent)}`;

      const on = {
        [eventKey]: (...args) => {
          const [e] = args;
          if (propsData[eventKey]) {
            propsData[eventKey](...args);
          }
          const target = e ? e.target : null;
          const value = target ? (isCheck ? target.checked : target.value) : e;
          props.setFormModel(field, value);
        },
      };
      const Comp = componentMap.get(component);

      const { autoSetPlaceHolder, size } = props.formProps;
      const propsData = {
        allowClear: true,
        getPopupContainer: trigger => trigger.parentNode,
        size,
        ...unref(getComponentsProps),
        disabled: unref(getDisable),
      };

      const isCreatePlaceholder = !propsData?.disabled && autoSetPlaceHolder;
      // RangePicker place is an array
      if (isCreatePlaceholder && component !== 'RangePicker' && component) {
        propsData.placeholder = unref(getComponentsProps)?.placeholder || createPlaceholderMessage(component);
      }
      propsData.codeField = field;
      propsData.formValues = unref(getValues);

      const bindValue = {
        [valueField || (isCheck ? 'checked' : 'value')]: props.formModel[field],
      };

      const compAttr = {
        ...propsData,
        ...on,
        ...bindValue,
      };

      if (!renderComponentContent) {
        return <Comp {...compAttr} />;
      }
      // 对组件的插槽处理
      const compSlot = isFunction(renderComponentContent)
        ? { ...renderComponentContent(unref(getValues)) }
        : {
            default: () => renderComponentContent,
          };
      return <Comp {...compAttr}>{compSlot}</Comp>;
    }

    function renderLabelHelpMessage() {
      // const { label, helpMessage, helpComponentProps, subLabel } = props.schema;
      const { label, subLabel } = props.schema;
      const renderLabel = subLabel ? (
        <span>
          {label} <span class="text-secondary">{subLabel}</span>
        </span>
      ) : (
        label
      );
      // const getHelpMessage = isFunction(helpMessage)
      //   ? helpMessage(unref(getValues))
      //   : helpMessage;
      // if (!getHelpMessage || Array.isArray(getHelpMessage) && getHelpMessage.length === 0) {
      //   return renderLabel;
      // }
      return (
        <span>
          {renderLabel}
          {/* <BasicHelp placement="top" class="mx-1" text={getHelpMessage} {...helpComponentProps} /> */}
        </span>
      );
    }

    // 渲染表单FormItem
    function renderItem() {
      const { itemProps, slot, render, field, suffix, label, subLabel, component } = props.schema;
      const { labelCol, wrapperCol } = unref(itemLabelWidthProp);
      const { colon } = props.formProps;
      // 插槽->render->component类型显示
      if (component === 'Divider') {
        return (
          <Col span={24}>
            <Divider {...unref(getComponentsProps)}>{renderLabelHelpMessage()}</Divider>
          </Col>
        );
      } else if (component === 'CellTitle') {
        return (
          <Col span={24}>
            <CellTitle label={label} subLabel={subLabel} {...unref(getComponentsProps)}></CellTitle>
          </Col>
        );
      } else {
        const getContent = () => {
          return slot ? getSlot(slots, slot, unref(getValues)) : render ? render(unref(getValues)) : renderComponent();
        };

        const showSuffix = !!suffix;
        const getSuffix = isFunction(suffix) ? suffix(unref(getValues)) : suffix;
        // {/* label={renderLabelHelpMessage()} */}

        return (
          <Form.Item
            name={field}
            colon={colon}
            class={{ 'suffix-item': showSuffix }}
            {...itemProps}
            label={label}
            rules={handleRules()}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <div style="display:flex">
              <div style="flex:1;">{getContent()}</div>
              {showSuffix && <span class="suffix">{getSuffix}</span>}
            </div>
          </Form.Item>
        );
      }
    }

    return () => {
      const { colProps = {}, colSlot, renderColContent, component } = props.schema;
      if (!componentMap.has(component)) {
        return null;
      }

      const { baseColProps = {} } = props.formProps;
      const realColProps = { ...baseColProps, ...colProps };
      const { isIfShow, isShow } = getShow();
      const values = unref(getValues);

      const getContent = () => {
        return colSlot ? getSlot(slots, colSlot, values) : renderColContent ? renderColContent(values) : renderItem();
      };

      return (
        isIfShow && (
          <Col {...realColProps} v-show={isShow}>
            {getContent()}
          </Col>
        )
      );
    };
  },
});
</script>
