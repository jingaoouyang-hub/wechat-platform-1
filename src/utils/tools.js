import { useStoreApp } from '@/store';
import { http } from '@/axios/request';
import { message } from 'ant-design-vue';

/* eslint-disable no-redeclare */
/* eslint-disable eqeqeq */
/*
 *@param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
 *
 * @return {Function}     返回一个“去弹跳”了的函数
 */
export function debounce(fn, delay = 500) {
  let timer = null; // 声明计时器
  return function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

/**
 * 十六进制颜色值转rgb值
 * 例如：colorRgb(#ee9922) = {r:238,g:153,b:34}
 */
export function colorRgb(sColor) {
  if (sColor) {
    sColor = sColor.toLowerCase();
  }
  // 十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    // 处理六位的颜色值
    let sColorChange = [];
    for (let i = 1; i < sColor.length; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
    }

    return {
      r: sColorChange[0],
      g: sColorChange[1],
      b: sColorChange[2],
    };
  }
  return {};
}

/**
 * 获取请求头中的文件名
 * @param {string} name
 * @returns {Boolean}
 */
export function getFileName(name) {
  let result = null;
  if (name && /filename=.*/gi.test(name)) {
    result = name.match(/filename=.*/gi);
    return decodeURI(result[0].split('=')[1]);
  }
  return 'file';
}

/**
 * 将带小数点的数字切割成整数和小数部分
 * @param text {String||Number}   要传文本
 * @param digits {Number}   默认是2位小数点
 * @return {Array}   返回一个数组，Array[0]是整数部分，Array[1]是小数部分，
 *  * 用法：import { formatNumber } from '@/utils/utils.js';
 *          data: Money: formatNumber,
 *          {{ Money(cash)[0] }}.{{ Money(cash)[1] }}
 */
export function formatNumber(text = 0, digits = 2) {
  if (!text) {
    text = 0;
  }
  if (!(text instanceof Number)) {
    text = Number(text);
  }

  text = text.toFixed(digits).toString();
  if (text.indexOf('.') == -1) {
    text = text + '.00';
  }
  return text.indexOf('.') != -1 ? text.split('.') : text.join('');
}

/*
 *@param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
 *
 * @return {Function}     返回一个“去弹跳”了的函数
 */
export function createUUID() {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now(); // use high-precision timer if available
  }
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

/**
 * 深拷贝
 * @param {*} obj 拷贝对象(object or array)
 * @param {*} cache 缓存数组
 */
export function deepClone(obj, cache = []) {
  // typeof [] => 'object'
  // typeof {} => 'object'
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
  /**
   * 类似下面这种
   * var a = {b:1}
   * a.c = a
   * 资料: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
   */
  const hit = cache.filter(c => c.original === obj)[0];
  if (hit) {
    return hit.copy;
  }

  const copy = Array.isArray(obj) ? [] : {};
  // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
  cache.push({
    original: obj,
    copy,
  });
  Object.keys(obj).forEach(key => {
    copy[key] = deepClone(obj[key], cache);
  });

  return copy;
}

/**
 * 两个对象的深度合并
 * @param {*} obj1 拷贝对象1
 * @param {*} obj2 拷贝对象2
 */
// eslint-disable-next-line camelcase
export function deepMerge(obj1_1 = {}, obj2_1 = {}) {
  let key = null;
  // let obj1 = JSON.parse(JSON.stringify(obj1_1)), obj2 = JSON.parse(JSON.stringify(obj2_1))
  const obj1 = deepClone(obj1_1);
  const obj2 = deepClone(obj2_1);
  for (key in obj2) {
    // 如果target(也就是obj1[key])存在，且是对象的话再去调用deepMerge，否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
    // 如果obj2[key]没有值或者值不是对象，此时直接替换obj1[key]
    obj1[key] =
      obj1[key] && obj1[key].toString() === '[object Object]' && obj2[key] && obj2[key].toString() === '[object Object]'
        ? deepMerge(obj1[key], obj2[key])
        : obj2[key] && (obj1[key] = obj2[key]);
  }
  return obj1;
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function getQueryParam() {
  return { ...arguments };
}

/**
 * 交换数组两个下标元素的位置
 * @param {Array} arr
 * @param {String} index1
 * @param {String} index2
 * @returns {Array}
 * 用法：//点击上移 clickUp(index){ this.swapArray(this.tableData, index-1, index); },
        //点击下移 clickDown(index){ this.swapArray(this.tableData, index, index+1); },
 */
export function swapArray(arr, oldIndex, newIndex) {
  arr[oldIndex] = arr.splice(newIndex, 1, arr[oldIndex])[0];
  return arr;
}

/**
 * 递归构建树方法
 * data：需要递归的数组
 * children：需要将空的数组子元素设为undefined的子数组名字
 */
export function getTreeData(data, children = 'children') {
  // 循环遍历json数据
  for (let i = 0; i < data.length; i++) {
    if (data[i][children] && data[i][children].length) {
      // children若不为空数组，则继续 递归调用 本方法
      getTreeData(data[i][children], children);
    } else {
      // children若为空数组，则将children设为undefined
      data[i][children] = undefined;
      // data[i]['isLeaf'] = true;
    }
  }
  return data;
}

/**
 * 将一维数组拆分为二维数组
 * arr：需要拆分的一维的数组
 * size：需要将空的数组子元素设为undefined的子数组名字
 */
export function arrToTwoDim(arr, size) {
  let result = [];

  arr.forEach((item, index) => {
    const page = Math.floor(index / size);
    if (!result[page]) {
      result[page] = [];
    }
    result[page].push(item);
  });
  return result;
}

/**
 * 对象转url参数
 * @param {*} data,对象
 * @param {*} isPrefix,是否自动加上"?"
 */
export function queryParams(data = {}, isPrefix = true, arrayFormat = 'brackets') {
  const prefix = isPrefix ? '?' : '';
  const _result = [];
  if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1) {
    arrayFormat = 'brackets';
  }
  for (const key in data) {
    const value = data[key];
    // 去掉为空的参数
    if (['', undefined, null].indexOf(value) >= 0) {
      continue;
    }
    // 如果值为数组，另行处理
    if (value.constructor === Array) {
      // e.g. {ids: [1, 2, 3]}
      switch (arrayFormat) {
        case 'indices':
          // 结果: ids[0]=1&ids[1]=2&ids[2]=3
          for (let i = 0; i < value.length; i++) {
            _result.push(key + '[' + i + ']=' + value[i]);
          }
          break;
        case 'brackets':
          // 结果: ids[]=1&ids[]=2&ids[]=3
          value.forEach(_value => {
            _result.push(key + '[]=' + _value);
          });
          break;
        case 'repeat':
          // 结果: ids=1&ids=2&ids=3
          value.forEach(_value => {
            _result.push(key + '=' + _value);
          });
          break;
        case 'comma':
          // 结果: ids=1,2,3
          // eslint-disable-next-line no-case-declarations
          let commaStr = '';
          value.forEach(_value => {
            commaStr += (commaStr ? ',' : '') + _value;
          });
          _result.push(key + '=' + commaStr);
          break;
        default:
          value.forEach(_value => {
            _result.push(key + '[]=' + _value);
          });
      }
    } else {
      _result.push(key + '=' + value);
    }
  }
  return _result.length ? prefix + _result.join('&') : '';
}

export function getAge(strBirthday) {
  let returnAge;
  let strBirthdayArr = strBirthday.split('-');
  let birthYear = strBirthdayArr[0];
  let birthMonth = strBirthdayArr[1];
  let birthDay = strBirthdayArr[2];
  let d = new Date();
  let nowYear = d.getFullYear();
  let nowMonth = d.getMonth() + 1;
  let nowDay = d.getDate();
  if (nowYear == birthYear) {
    returnAge = 0; // 同年 则为0岁
  } else {
    let ageDiff = nowYear - birthYear; // 年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        let dayDiff = nowDay - birthDay; // 日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      } else {
        let monthDiff = nowMonth - birthMonth; // 月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      }
    } else {
      returnAge = ''; // 返回 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge; // 返回周岁年龄
}

export function isEmpty(val) {
  // null or undefined
  if (val == null) {
    return true;
  }

  if (typeof val === 'boolean') {
    return false;
  }

  if (typeof val === 'number') {
    return !val;
  }

  if (val instanceof Error) {
    return val.message === '';
  }

  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case '[object String]':
    case '[object Array]':
      return !val.length;

    // Map or Set or File
    case '[object File]':
    case '[object Map]':
    case '[object Set]': {
      return !val.size;
    }
    // Plain Object
    case '[object Object]': {
      return !Object.keys(val).length;
    }
  }

  return false;
}

/**
 * 处理千分位 + 单位
 * @param value 值
 * @param length 小数点后几位
 * @param nullValue 空值替换符号
 * @param symbolValue 千分位符号
 * @returns {string}
 */
export function numberUnit(value, length = 2, nullValue = '--', symbolValue = ',') {
  const replace = /\B(?=(\d{3})+(?!\d))/g;
  let num = '';
  let unit = '';
  if (!value || value === 'null' || value === 'undefined') {
    return nullValue;
  }
  num = Number(value);
  if (num > 10000 && num < 100000000) {
    unit = '万';
    num = num / 10000;
  }
  if (num >= 100000000) {
    unit = '亿';
    num = num / 100000000;
  }
  num = num.toFixed(length);

  const strNum = String(num).split('.');
  if (strNum[1] !== '00') {
    const decimalsNum = strNum[1].split('');
    return `${strNum[0].replace(replace, symbolValue)}.${decimalsNum[1] === '0' ? decimalsNum[0] : strNum[1]}` + unit;
  } else {
    return `${strNum[0].replace(replace, symbolValue)}${unit}`;
  }
}
/**
 * 转换存储单位
 * @param size：文件大小 单位kb
 */
export function sizeTostr(size) {
  let data = '';
  if (size < 0.1 * 1024) {
    // 如果小于0.1KB转化成B
    data = size.toFixed(2) + 'B';
  } else if (size < 0.1 * 1024 * 1024) {
    // 如果小于0.1MB转化成KB
    data = (size / 1024).toFixed(2) + 'KB';
  } else if (size < 0.1 * 1024 * 1024 * 1024) {
    // 如果小于0.1GB转化成MB
    data = (size / (1024 * 1024)).toFixed(2) + 'MB';
  } else {
    // 其他转化成GB
    data = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  }
  let sizestr = data + '';
  let len = sizestr.indexOf('.');
  let dec = sizestr.substr(len + 1, 2);
  if (dec == '00') {
    // 当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
}

/**
 * 向后补零：nextFixZero
 * @param num： 被操作数
 * @param n： 固定的总位数
 */
export function nextFixZero(num, n) {
  return (num + Array(n).join(0)).slice(0, n);
}

/** 千位加,号 */
export function thousandFormat(num) {
  return num ? num.toLocaleString() : 0;
  // return Number(num)
  //   .toFixed(2)
  //   .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

// 处理小数点
export function toFixedNumber(value, length = 2) {
  return value === null ? '--' : (value && parseFloat(Number(value).toFixed(length))) || 0;
  // return value !== null ? parseFloat(Number(value).toFixed(length)) : '';
}

/**
 * 格式化万位文本显示
 * @param num{number}
 * @returns {string|*}
 */
export function formatTenThousandText(num) {
  if (num > 9999) {
    const data = (num / 10000).toFixed(2);
    return data + '万';
  }
  return num;
}

/**
 * 处理对象参数值，排除对象参数值为”“、null、undefined，并返回一个新对象
 **/
export function dealObjectValue(obj) {
  if (!obj || !typeof obj === 'object') {
    return;
  }
  const keys = Object.keys(obj);
  for (let key of keys) {
    const val = obj[key];
    if (typeof val === 'undefined' || ((typeof val === 'object' || typeof val === 'string') && !val)) {
      // 如属性值为null或undefined或''，则将该属性删除
      delete obj[key];
    } else if (typeof val === 'object') {
      // 属性值为对象，递归调用
      dealObjectValue(obj[key]);

      if (Object.keys(obj[key]).length === 0) {
        // 如某属性的值为不包含任何属性的独享，则将该属性删除
        delete obj[key];
      }
    }
  }
}

/**
 * 将hex颜色转成rgb
 * @param hex
 * @param opacity
 * @returns {{red: number, rgba: string, green: number, blue: number}}
 */
export function hexToRgba(hex, opacity) {
  let RGBA =
    'rgba(' +
    parseInt('0x' + hex.slice(1, 3)) +
    ',' +
    parseInt('0x' + hex.slice(3, 5)) +
    ',' +
    parseInt('0x' + hex.slice(5, 7)) +
    ',' +
    opacity +
    ')';
  return {
    red: parseInt('0x' + hex.slice(1, 3)),
    green: parseInt('0x' + hex.slice(3, 5)),
    blue: parseInt('0x' + hex.slice(5, 7)),
    rgba: RGBA,
  };
}

/**
 * 按照基础顺序排序 互换位置
 * @param arr{Array} 原数组
 * @param sortArr 排序数组 ['']
 * @param sortKey 排序的key
 * @return {*}
 */
export function baseSort(arr, sortArr, sortKey) {
  const key = sortKey || 'title';
  sortArr
    .filter(name => arr.find(d => d[key] === name))
    .map((name, index) => {
      const minItemIndex = arr.findIndex(d => d[key] === name);
      if (arr[index] && arr[minItemIndex]) {
        [arr[index], arr[minItemIndex]] = [arr[minItemIndex], arr[index]];
      }
    });

  return arr;
}

/**
 * 滚动到某个元素
 * @param {*} container 容器
 * @param {*} selected 某个节点
 */
export function scrollIntoView(container, selected) {
  if (!selected) {
    container.scrollTop = 0;
    return;
  }

  const offsetParents = [];
  let pointer = selected.offsetParent;
  while (pointer && container !== pointer && container.contains(pointer)) {
    offsetParents.push(pointer);
    pointer = pointer.offsetParent;
  }
  const top = selected.offsetTop + offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);
  const bottom = top + selected.offsetHeight;
  const viewRectTop = container.scrollTop;
  const viewRectBottom = viewRectTop + container.clientHeight;

  if (top < viewRectTop) {
    container.scrollTop = top;
  } else if (bottom > viewRectBottom) {
    container.scrollTop = bottom - container.clientHeight;
  }
}

/**
 * 下载文件post
 * @param url
 * @param data
 * @returns {Promise}
 */
export const postFile = (url, data, fileName, methodType = 'post') => {
  const storeApp = useStoreApp();
  storeApp.changeValue('loading', true);
  return new Promise((resolve, reject) => {
    const requestParmams = {
      url: url,
      method: methodType,
      data,
      responseType: 'blob',
      timeout: 5 * 60 * 1000,
    };
    http(requestParmams)
      .then(res => {
        const { data } = res;
        // 下载文件报错处理
        if (data.type === 'text/plain' || data.type === 'application/json') {
          const fileReader = new FileReader();
          fileReader.onloadend = () => {
            const jsonData = JSON.parse(fileReader.result);
            // message.error(jsonData.message || '错误码' + jsonData.code);
            if (jsonData.code == 401) {
              window.location.reload();
              // router.push('/login');
            }
            if (jsonData.code !== 200) {
              let msg = jsonData?.message || jsonData?.msg;
              message.error(msg);
            }
          };
          fileReader.readAsText(res.data);
          reject(res);
          return;
        }
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.setAttribute('download', fileName || getFileName(res.headers['content-disposition']));
        document.body.appendChild(a);
        a.click(); // 执行下载
        window.URL.revokeObjectURL(a.href); // 释放url
        document.body.removeChild(a);
        resolve(res);
      })
      .catch(err => {
        reject(err);
      })
      .finally(() => {
        storeApp.changeValue('loading', false);
      });
  });
};
