import { isArray, isFunction, isObject, isString, isDef, isNullOrUnDef } from '@/utils/is';
import { deepMerge } from '@/utils/tools';
import { dateItemType, handleInputNumberValue, defaultValueComponents } from '../helper';
import { dateUtil } from '@/utils/dateUtil';
import { cloneDeep, uniqBy } from 'lodash-es';

export function useFormEvents({
  emit,
  getProps,
  formModel,
  getSchema,
  defaultValueRef,
  formElRef,
  schemaRef,
  handleFormValues,
}) {
  async function resetFields() {
    const { resetFunc, submitOnReset } = unref(getProps);
    resetFunc && isFunction(resetFunc) && (await resetFunc());

    const formEl = unref(formElRef);
    if (!formEl) {
      return;
    }

    Object.keys(formModel).forEach(key => {
      const schema = unref(getSchema).find(item => item.field === key);
      const isInput = schema?.component && defaultValueComponents.includes(schema.component);
      const defaultValue = cloneDeep(defaultValueRef.value[key]);
      formModel[key] = isInput ? defaultValue || '' : defaultValue;
    });
    nextTick(() => clearValidate());

    emit('reset', toRaw(formModel));
    submitOnReset && handleSubmit();
  }

  /**
   * @description: Set form value
   */
  async function setFieldsValue(values) {
    const fields = unref(getSchema)
      .map(item => item.field)
      .filter(Boolean);

    // key 支持 a.b.c 的嵌套写法
    const delimiter = '.';
    const nestKeyArray = fields.filter(item => item.indexOf(delimiter) >= 0);

    const validKeys = [];
    Object.keys(values).forEach(key => {
      const schema = unref(getSchema).find(item => item.field === key);
      let value = values[key];

      const hasKey = Reflect.has(values, key);

      value = handleInputNumberValue(schema?.component, value);
      // 0| '' is allow
      if (hasKey && fields.includes(key)) {
        // time type
        if (itemIsDateType(key)) {
          if (Array.isArray(value)) {
            const arr = [];
            for (const ele of value) {
              arr.push(ele ? dateUtil(ele) : null);
            }
            formModel[key] = arr;
          } else {
            const { componentProps } = schema || {};
            let _props = componentProps;
            if (typeof componentProps === 'function') {
              _props = _props({ formModel });
            }
            formModel[key] = value ? (_props?.valueFormat ? value : dateUtil(value)) : null;
          }
        } else {
          formModel[key] = value;
        }
        validKeys.push(key);
      } else {
        nestKeyArray.forEach(nestKey => {
          try {
            // eslint-disable-next-line no-eval
            const value = eval('values' + delimiter + nestKey);
            if (isDef(value)) {
              formModel[nestKey] = value;
              validKeys.push(nestKey);
            }
          } catch (e) {
            console.log(e);
            // key not exist
            if (isDef(defaultValueRef.value[nestKey])) {
              formModel[nestKey] = cloneDeep(defaultValueRef.value[nestKey]);
            }
          }
        });
      }
    });
    validateFields(validKeys).catch(() => {
      console.log(888);
    });
  }
  /**
   * @description: Delete based on field name
   */
  async function removeSchemaByField(fields) {
    const schemaList = cloneDeep(unref(getSchema));
    if (!fields) {
      return;
    }

    let fieldList = isString(fields) ? [fields] : fields;
    // if (isString(fields)) {
    //   fieldList = [fields];
    // }
    for (const field of fieldList) {
      _removeSchemaByFeild(field, schemaList);
    }
    schemaRef.value = schemaList;
  }

  /**
   * @description: Delete based on field name
   */
  function _removeSchemaByFeild(field, schemaList) {
    if (isString(field)) {
      const index = schemaList.findIndex(schema => schema.field === field);
      if (index !== -1) {
        delete formModel[field];
        schemaList.splice(index, 1);
      }
    }
  }

  /**
   * @description: Insert after a certain field, if not insert the last
   */
  async function appendSchemaByField(schema, prefixField, first = false) {
    const schemaList = cloneDeep(unref(getSchema));

    const index = schemaList.findIndex(schema => schema.field === prefixField);

    if (!prefixField || index === -1 || first) {
      first ? schemaList.unshift(schema) : schemaList.push(schema);
      schemaRef.value = schemaList;
      _setDefaultValue(schema);
      return;
    }
    if (index !== -1) {
      schemaList.splice(index + 1, 0, schema);
    }
    _setDefaultValue(schema);

    schemaRef.value = schemaList;
  }

  async function resetSchema(data) {
    let updateData = [];
    if (isObject(data)) {
      updateData.push(data);
    }
    if (isArray(data)) {
      updateData = [...data];
    }

    const hasField = updateData.every(
      item => item.component === 'Divider' || (Reflect.has(item, 'field') && item.field),
    );

    if (!hasField) {
      console.error('All children of the form Schema array that need to be updated must contain the `field` field');
      return;
    }
    schemaRef.value = updateData;
  }

  async function updateSchema(data) {
    let updateData = [];
    if (isObject(data)) {
      updateData.push(data);
    }
    if (isArray(data)) {
      updateData = [...data];
    }

    const hasField = updateData.every(
      item => item.component === 'Divider' || (Reflect.has(item, 'field') && item.field),
    );

    if (!hasField) {
      console.error('All children of the form Schema array that need to be updated must contain the `field` field');
      return;
    }
    const schema = [];
    updateData.forEach(item => {
      unref(getSchema).forEach(val => {
        if (val.field === item.field) {
          const newSchema = deepMerge(val, item);
          schema.push(newSchema);
        } else {
          schema.push(val);
        }
      });
    });
    _setDefaultValue(schema);

    schemaRef.value = uniqBy(schema, 'field');
  }

  function _setDefaultValue(data) {
    let schemas = [];
    if (isObject(data)) {
      schemas.push(data);
    }
    if (isArray(data)) {
      schemas = [...data];
    }

    const obj = {};
    const currentFieldsValue = getFieldsValue();
    schemas.forEach(item => {
      if (
        item.component != 'Divider' &&
        Reflect.has(item, 'field') &&
        item.field &&
        !isNullOrUnDef(item.defaultValue) &&
        !(item.field in currentFieldsValue)
      ) {
        obj[item.field] = item.defaultValue;
      }
    });
    setFieldsValue(obj);
  }

  function getFieldsValue() {
    const formEl = unref(formElRef);
    if (!formEl) {
      return {};
    }
    return handleFormValues(toRaw(unref(formModel)));
  }

  /**
   * @description: Is it time
   */
  function itemIsDateType(key) {
    return unref(getSchema).some(item => {
      return item.field === key ? dateItemType.includes(item.component) : false;
    });
  }

  async function validateFields(nameList) {
    return unref(formElRef)?.validateFields(nameList);
  }

  async function validate(nameList) {
    return await unref(formElRef)?.validate(nameList);
  }

  async function clearValidate(name) {
    await unref(formElRef)?.clearValidate(name);
  }

  async function scrollToField(name, options) {
    await unref(formElRef)?.scrollToField(name, options);
  }

  /**
   * @description: Form submission
   */
  async function handleSubmit(e) {
    e && e.preventDefault();
    const { submitFunc } = unref(getProps);
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc();
      return;
    }
    const formEl = unref(formElRef);
    if (!formEl) {
      return;
    }
    try {
      const values = await validate();
      const res = handleFormValues(values);
      emit('submit', res);
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    handleSubmit,
    clearValidate,
    validate,
    validateFields,
    getFieldsValue,
    updateSchema,
    resetSchema,
    appendSchemaByField,
    removeSchemaByField,
    resetFields,
    setFieldsValue,
    scrollToField,
  };
}
