<template>
  <AForm
    v-bind="getBindValue"
    :class="getFormClass"
    ref="formElRef"
    :model="formModel"
    @keypress.enter="handleEnterPress"
  >
    <Row v-bind="getRow">
      <slot name="formHeader"></slot>
      <template v-for="schema in getSchema" :key="schema.field">
        <FormItem
          :formActionType="formActionType"
          :schema="schema"
          :formProps="getProps"
          :allDefaultValues="defaultValueRef"
          :formModel="formModel"
          :setFormModel="setFormModel"
        >
          <template #[item]="data" v-for="item in Object.keys($slots)">
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </FormItem>
      </template>
      <slot name="formFooter"></slot>
    </Row>
  </AForm>
</template>
<script>
import { defineComponent } from 'vue';
// 组件
import { Form as AForm, Row } from 'ant-design-vue';
import FormItem from './components/FormItem.vue';

// 方法
import { deepMerge } from '@/utils/tools.js';
import { dateUtil } from '@/utils/dateUtil';
import { basicProps } from './props';
import { cloneDeep } from 'lodash-es';

import { useDebounceFn } from '@vueuse/core';
import { useFormValues } from './hooks/useFormValues';
import { useFormEvents } from './hooks/useFormEvents';
const DATE_TYPE = ['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'];

function genType() {
  return [...DATE_TYPE, 'RangePicker'];
}
const dateItemType = genType();
export default defineComponent({
  name: 'BasicForm',
  components: { FormItem, AForm, Row },
  props: basicProps,
  emits: ['advanced-change', 'reset', 'submit', 'register', 'field-value-change'],
  setup(props, { emit, attrs }) {
    const formModel = reactive({});

    const defaultValueRef = ref({}); // 存储默认值
    const isInitedDefaultRef = ref(false);
    const propsRef = ref({}); // 通过setProps方法设置得props，会覆盖组件本身的props
    const schemaRef = ref(null); // 不知道拿来干嘛的
    const formElRef = ref(null); // 表单ref实例

    const prefixCls = 'basic-form';

    // 获取当前组件所有的props
    const getProps = computed(() => {
      return { ...props, ...unref(propsRef) };
    });

    // 表单class
    const getFormClass = computed(() => {
      return [
        prefixCls,
        {
          [`${prefixCls}--compact`]: unref(getProps).compact,
        },
      ];
    });

    // Row组件的样式和属性
    const getRow = computed(() => {
      const { baseRowStyle = {}, rowProps } = unref(getProps);
      return {
        style: baseRowStyle,
        ...rowProps,
      };
    });

    // 所有组件传下来的方法和属性
    const getBindValue = computed(() => ({ ...attrs, ...props, ...unref(getProps) }));

    // 获取schemas并处理时间默认值
    const getSchema = computed(() => {
      const schemas = unref(schemaRef) || unref(getProps).schemas;
      for (const schema of schemas) {
        const { defaultValue, component, isHandleDateDefaultValue = true } = schema;
        // handle date type
        if (isHandleDateDefaultValue && defaultValue && dateItemType.includes(component)) {
          if (!Array.isArray(defaultValue)) {
            schema.defaultValue = dateUtil(defaultValue);
          } else {
            const def = [];
            defaultValue.forEach(item => {
              def.push(dateUtil(item));
            });
            schema.defaultValue = def;
          }
        }
      }
      if (unref(getProps).showAdvancedButton) {
        return cloneDeep(schemas.filter(schema => schema.component !== 'Divider'));
      } else {
        return cloneDeep(schemas);
      }
    });

    const { handleFormValues, initDefault } = useFormValues({
      getProps,
      defaultValueRef,
      getSchema,
      formModel,
    });

    const {
      handleSubmit,
      setFieldsValue,
      clearValidate,
      validate,
      validateFields,
      getFieldsValue,
      updateSchema,
      resetSchema,
      appendSchemaByField,
      removeSchemaByField,
      resetFields,
      scrollToField,
    } = useFormEvents({
      emit,
      getProps,
      formModel,
      getSchema,
      defaultValueRef,
      formElRef: formElRef,
      schemaRef: schemaRef,
      handleFormValues,
    });

    watch(
      () => unref(getProps).model,
      () => {
        const { model } = unref(getProps);
        if (!model) {
          return;
        }
        setFieldsValue(model);
      },
      {
        immediate: true,
      },
    );

    watch(
      () => unref(getProps).schemas,
      schemas => {
        resetSchema(schemas ?? []);
      },
    );

    watch(
      () => getSchema.value,
      schema => {
        if (unref(isInitedDefaultRef)) {
          return;
        }
        if (schema?.length) {
          initDefault();
          isInitedDefaultRef.value = true;
        }
      },
    );

    watch(
      () => formModel,
      useDebounceFn(() => {
        unref(getProps).submitOnChange && handleSubmit();
      }, 300),
      { deep: true },
    );

    async function setProps(formProps) {
      propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
    }

    function setFormModel(key, value) {
      formModel[key] = value;
      const { validateTrigger } = unref(getBindValue);
      if (!validateTrigger || validateTrigger === 'change') {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        validateFields([key]).catch(() => {});
      }
      emit('field-value-change', key, value);
    }

    function handleEnterPress(e) {
      const { autoSubmitOnEnter } = unref(getProps);
      if (!autoSubmitOnEnter) {
        return;
      }
      if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
        const target = e.target;
        if (target && target.tagName && target.tagName.toUpperCase() == 'INPUT') {
          handleSubmit();
        }
      }
    }

    const formActionType = {
      getFieldsValue,
      setFieldsValue,
      resetFields,
      updateSchema,
      resetSchema,
      setProps,
      removeSchemaByField,
      appendSchemaByField,
      clearValidate,
      validateFields,
      validate,
      submit: handleSubmit,
      scrollToField: scrollToField,
    };

    onMounted(() => {
      initDefault();
      emit('register', formActionType);
    });

    return {
      getBindValue,
      handleEnterPress,
      formModel,
      defaultValueRef,
      getRow,
      getProps,
      formElRef,
      getSchema,
      formActionType: formActionType,
      setFormModel,
      getFormClass,
      ...formActionType,
    };
  },
});
</script>
<style lang="less">
// @prefix-cls: ~'@{namespace}-basic-form';

.basic-form {
  .ant-form-item {
    &-label label::after {
      margin: 0 6px 0 2px;
    }

    &-with-help {
      margin-bottom: 0;
    }

    &:not(.ant-form-item-with-help) {
      margin-bottom: 20px;
    }

    &.suffix-item {
      .ant-form-item-children {
        display: flex;
      }

      .ant-form-item-control {
        margin-top: 4px;
      }

      .suffix {
        display: inline-flex;
        padding-left: 6px;
        margin-top: 1px;
        line-height: 1;
        align-items: center;
      }
    }
  }

  .ant-form-explain {
    font-size: 14px;
  }

  &--compact {
    .ant-form-item {
      margin-bottom: 8px !important;
    }
  }
}
</style>
