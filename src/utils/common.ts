import router from '@/router';
import smCrypto from 'sm-crypto';
import JSEncrypt from 'jsencrypt';

// 根据子属性查找所有关联的层数
export const findPatentValue = (array: [], value: any, valueName = 'value', childrenName = 'children') => {
  if (!value || !Array.isArray(array)) {
    return [];
  }
  const result: any[] = [];
  let valid = false;
  const seek = (array: [], value: any) => {
    let parentValue: any = null;
    const up = (array: [], value: any, lastValue: any = '') => {
      array.forEach(v => {
        const val = v[valueName];
        const child: [] = v[childrenName];
        if (val === value) {
          valid = true;
          parentValue = lastValue;
          return;
        }
        if (child && child.length) {
          up(child, value, val);
        }
      });
    };
    up(array, value);
    if (parentValue) {
      result.unshift(parentValue);
      seek(array, parentValue);
    }
  };
  seek(array, value);
  return valid ? [...result, value] : [];
};

// 根据子属性查找所有关联的属性
export const findPatentMap = (array: [], value: any, valueName = 'value', childrenName = 'children', labelKey = '') => {
  if (!value || !Array.isArray(array)) {
    return [];
  }
  const result: any[] = [];
  let valid = false;
  const seek = (array: [], value: any) => {
    let parentValue: any = null;
    let labelName: any = null;
    const up = (array: [], value: any, lastValue: any = '') => {
      array.forEach(v => {
        const val = v[valueName];
        const child: [] = v[childrenName];
        if (val === value) {
          valid = true;
          parentValue = lastValue;
          labelName = v[labelKey] || v;
          return;
        }
        if (child && child.length) {
          up(child, value, val);
        }
      });
    };
    up(array, value);
    if (labelName) {
      result.unshift(labelName);
      seek(array, parentValue);
    }
  };
  seek(array, value);
  return valid ? [...result] : [];
};

// 防抖函数
export const debounce = (fn: any, delay: number) => {
  let timer: any = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
};

// 节流函数
export const throttle = (fn: any, delay: number) => {
  let timer: any = null;
  let status = false;
  return function (...args) {
    if (timer) {
      return;
    }
    if (!status) {
      status = true;
      fn.apply(this, args);
    }
    timer = setTimeout(() => {
      if (status) {
        fn.apply(this, args);
        timer = null;
      }
    }, delay);
  };
};

export const filedArrJoin = (dataArr = [], name: string, value: string) => {
  const datas: any = dataArr.map((o: any) => ({
    label: o[name],
    value: o[value],
  }));
  datas.unshift({ label: '全部', value: '' });
  return datas;
};

export const cacheRouter = (params: any) => {
  const routerStr = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&');
  if (routerStr) {
    router.replace({
      path: router.currentRoute.value.path,
      query: params,
    });
  }
};

export const getEnum = (val, opts) => opts?.find(item => item.value === val);

export const getArrayLabel = (arr: any, value: any, filedObj: any) => {
  if (arr) {
    const resultFiled = Object.assign({ label: 'label', value: 'value' }, filedObj);
    const obj = arr.find((o: any) => o[resultFiled.value] == value);
    return obj ? obj[resultFiled.label] : '';
  }
};

/**
 * 处理千分位 + 单位
 * @param value 值
 * @param length 小数点后几位
 * @param nullValue 空值替换符号
 * @param symbolValue 千分位符号
 * @returns {string}
 */
export function numberUnit(value: any, length: any = 2, nullValue: any = '--', symbolValue: any = ',') {
  const replace = /\B(?=(\d{3})+(?!\d))/g;
  let num: any = '';
  let unit: any = '';
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

export const getArrayObj = (arr: any, value: any) => {
  if (arr) {
    // 比较值
    let obj = arr.find((o: any) => o.value == value);
    if (obj) {
      return obj;
    }
    // 比较名称（后台可能直接返回中文的情况）
    obj = arr.find((o: any) => o.label == value);
    return obj;
  }
};

export function doEncrypt(msgString: string, publicKey: string) {
  let msg = msgString;
  if (typeof msgString !== 'string') {
    msg = JSON.stringify(msgString);
  }
  const sm2 = smCrypto.sm2;
  const cipherMode = 1; // 特别注意,此处前后端需保持一致
  // const publicKey2 = '04bbfbea94e01445784544b29b9430a7b5309d6c93d0a05df2bfd43497f7f8de20cce0bf934f69e90ea399b372865899506a0abccd23a660dd191480014f2857cf';
  // 加密结果
  const encryptData = sm2.doEncrypt(msg, publicKey, cipherMode);
  // 加密后的密文前需要添加04，后端才能正常解密
  return '04' + encryptData;
}

export const commonEncrypt = (value: any) => {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(
    '-----BEGIN PUBLIC KEY-----MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJPXoncPIK+pvTzNIlAIcL1nhOL42XkOwXDu9Y+fvZbGsT1VhKdLMpDQa34/JvrUx9gV2OBBAO/TyXxsZCMl2MUCAwEAAQ==-----END PUBLIC KEY-----',
  );
  return encryptor.encrypt(value);
};

export function commonDecrypt(msg: any) {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(
    '-----BEGIN RSA PRIVATE KEY-----MIIBOwIBAAJBAJPXoncPIK+pvTzNIlAIcL1nhOL42XkOwXDu9Y+fvZbGsT1VhKdLMpDQa34/JvrUx9gV2OBBAO/TyXxsZCMl2MUCAwEAAQJATx/SWMwk3z8GA7t6CMFrrULxERTEN5EZIJsTm6mPq1ibNx9TZbOtbmfd6NKqyCtaKP1RNSbyXA4lfWnBssS9ZQIhAOI9UerijpQA431m+ODrts5++hAcUU8Gu0QGQTQNq/bPAiEAp0pEO9H0P6oj23tMWVm+qJnFY4Pf/elL5HxipkCfXCsCIGRc0YdCg/+SOVj7IjMdPhZy69nTxhopoU92+tvtqLivAiEAmUIokMUgBtNQVlr270SQrtVxSGIgavW4WXK6zaSWWlECIQCjY/U9/mDsCgvTRrpfpOvxYQZQBSj0ninI4qfvKaV5Tg==-----END RSA PRIVATE KEY-----',
  );
  const decryptMsg = decrypt.decrypt(msg);
  return decryptMsg;
}

export const getImageUrl = (name: string, type: string) => {
  return new URL(`../assets/images/${name}.${type}`, import.meta.url).href;
};

export function flatArray(multiArr: any[]) {
  const arr: any[] = [];
  const multiArrFn = (changeArr: any[], key = 'children') => {
    for (let i = 0; i < changeArr.length; i++) {
      const item = Object.assign({}, changeArr[i]);
      delete item[key];
      arr.push(item);
      console.log('arr', arr);

      if (changeArr[i][key] && changeArr[i][key].length) {
        multiArrFn(changeArr[i][key]);
      }
    }
  };
  multiArrFn(multiArr);
  return arr;
}

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any;
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component;
};

// 下载url文件
export const downloadFile = (filename: string, filePath: string) => {
  const link: any = document.createElement('a');
  fetch(filePath)
    .then((res: any) => res.blob())
    .then((blob: any) => {
      // 将链接地址字符内容转变成blob地址
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      // link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    });
};
