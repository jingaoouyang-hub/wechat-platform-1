import { isArray, isFunction, isObject, isString, isNullOrUnDef } from '@/utils/is';
import { dateUtil } from '@/utils/dateUtil';
import { unref } from 'vue';
import { cloneDeep, set } from 'lodash-es';

interface UseFormValuesContext {
  defaultValueRef: any;
  getSchema: any;
  getProps: any;
  formModel: any;
}

/**
 * @desription 解构数组链接键。此方法将改变目标。(没看懂)
 */
function tryDeconstructArray(key: string, value: any, target: any) {
  const pattern = /^\[(.+)\]$/;
  if (pattern.test(key)) {
    const match = key.match(pattern);
    if (match && match[1]) {
      const keys = match[1].split(',');
      value = Array.isArray(value) ? value : [value];
      keys.forEach((k, index) => {
        set(target, k.trim(), value[index]);
      });
      return true;
    }
  }
}

/**
 * @desription 解构对象链接键。此方法将改变目标。(没看懂)
 */
function tryDeconstructObject(key: string, value: any, target: any) {
  const pattern = /^\{(.+)\}$/;
  if (pattern.test(key)) {
    const match = key.match(pattern);
    if (match && match[1]) {
      const keys = match[1].split(',');
      value = isObject(value) ? value : {};
      keys.forEach(k => {
        set(target, k.trim(), value[k.trim()]);
      });
      return true;
    }
  }
}

export function useFormValues({ defaultValueRef, getSchema, formModel, getProps }: UseFormValuesContext) {
  // 处理表单值
  function handleFormValues(values: any) {
    if (!isObject(values)) {
      return {};
    }
    const res: any = {};
    for (const item of Object.entries(values)) {
      let [, value] = item;
      const [key] = item;
      // 1、判断对象的key不存在
      // 2、值是数组且为空
      // 3、值是方法
      // 跳出本次循环
      if (!key || (isArray(value) && value.length === 0) || isFunction(value)) {
        continue;
      }
      const transformDateFunc = unref(getProps).transformDateFunc;
      // 如果是对象，可能是时间，对时间的值格式化处理
      if (isObject(value)) {
        value = transformDateFunc?.(value);
      }
      // 如果是数组，可能是时间，对时间的值格式化处理
      if (isArray(value) && value[0]?.format && value[1]?.format) {
        value = value.map(item => transformDateFunc?.(item));
      }
      // 移除空格
      if (isString(value)) {
        value = value.trim();
      }
      if (!tryDeconstructArray(key, value, res) && !tryDeconstructObject(key, value, res)) {
        set(res, key, value);
      }
    }
    return handleRangeTimeValue(res);
  }

  /**
   * @description: 处理时间间隔参数
   */
  function handleRangeTimeValue(values: any) {
    const fieldMapToTime = unref(getProps).fieldMapToTime;

    // 如果fieldMapToTime没有设置，不需要对时间处理
    if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
      return values;
    }

    // 举例
    //  fieldMapToTime: [
    //   // data为时间组件在表单内的字段，startTime，endTime为转化后的开始时间于结束时间
    //   // 'YYYY-MM-DD'为时间格式，参考moment
    //   ['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD'],
    //   // 支持多个字段
    //   ['datetime1', ['startTime1', 'endTime1'], 'YYYY-MM-DD HH:mm:ss'],
    // ],
    for (const [field, [startTimeKey, endTimeKey], format = 'YYYY-MM-DD'] of fieldMapToTime) {
      if (!field || !startTimeKey || !endTimeKey) {
        continue;
      }
      // 如果要转换的值为空，请删除该字段
      if (!values[field]) {
        Reflect.deleteProperty(values, field);
        continue;
      }

      const [startTime, endTime]: string[] = values[field];

      const [startTimeFormat, endTimeFormat] = Array.isArray(format) ? format : [format, format];

      values[startTimeKey] = dateUtil(startTime).format(startTimeFormat);
      values[endTimeKey] = dateUtil(endTime).format(endTimeFormat);
      Reflect.deleteProperty(values, field);
    }

    return values;
  }
  /**
   * @description: 默认值初始化
   */
  function initDefault() {
    const schemas = unref(getSchema);
    const obj: any = {};
    schemas.forEach(item => {
      const { defaultValue } = item;
      if (!isNullOrUnDef(defaultValue)) {
        obj[item.field] = defaultValue;
        if (formModel[item.field] === undefined) {
          // formModel赋默认值
          formModel[item.field] = defaultValue;
        }
      }
    });
    // 把默认值存储起来
    defaultValueRef.value = cloneDeep(obj);
  }

  return { handleFormValues, initDefault };
}
