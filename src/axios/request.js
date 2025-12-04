import axios from 'axios';
import router from '@/router';
import { message } from 'ant-design-vue';
import { getFileName } from '@/utils/tools';
import { SAVE_TOKEN } from '@/store/mutation-types';
import storage from 'store';

// 仓库数据
import { useStoreApp } from '@/store';

// 多个请求loading 处理;
const loadingHandle = {
  loadingCount: 0,
  add: function () {
    const storeApp = useStoreApp();
    storeApp.changeValue('loading', true);
    this.loadingCount++;
  },
  subtract: function () {
    const storeApp = useStoreApp();
    this.loadingCount--;
    if (this.loadingCount === 0) {
      storeApp.changeValue('loading', false);
    }
  },
};

const http = axios.create({
  baseURL: window.location.pathname + 'apis/',
  headers: {
    'content-type': 'application/json;charset=UTF-8',
  },
  timeout: 5 * 60 * 1000, // 请求超时时间
});
/**
 * @description 修改全局默认配置
 * @param {Function}
 */

// 请求拦截器
http.interceptors.request.use(
  config => {
    const token = storage.get(SAVE_TOKEN);
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

// 响应拦截器
http.interceptors.response.use(
  response => {
    if (response.request.responseType) {
      // 如果是文件流，则返回response
      return response;
    } else {
      return response.data;
    }
  },
  error => {
    if (error && error.statusCode) {
      switch (error.statusCode) {
        case 401: // 未登录
          router.push('/login');
          break;
        case 403:
          message.error('您没有访问权限!');
          break;
        default:
          message.error('网络请求异常, 请检查您的网络设置后刷新重试!');
          break;
      }
    } else {
      message.error('网络请求异常, 请检查您的网络设置后刷新重试!');
    }
    return Promise.reject(error);
  },
);

// 请求基类
class BaseRequest {
  constructor(baseURL = '', config = {}) {
    this.baseAxios = http;
    this.baseURL = baseURL;
    this.config = config;
  }

  get(url, params, config = {}) {
    return this.sendRequest(
      {
        method: 'GET',
        url,
        params,
      },
      config,
    );
  }

  post(url, data, config = {}) {
    return this.sendRequest(
      {
        method: 'POST',
        url,
        data,
      },
      config,
    );
  }

  postForm(url, data, config = {}) {
    return this.sendRequest(
      {
        method: 'POST',
        url,
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
      config,
    );
  }

  put(url, data, config = {}) {
    return this.sendRequest(
      {
        method: 'PUT',
        url,
        data,
      },
      config,
    );
  }

  delete(url, data, config = {}) {
    return this.sendRequest(
      {
        method: 'DELETE',
        url,
        data,
      },
      config,
    );
  }

  getFile(url, params = {}, config = {}) {
    const requestParmams = {
      url: url,
      method: 'get',
      params: params,
      data: {
        getFile: true,
      },
      headers: {
        'content-type': 'application/json',
      },
      responseType: 'blob',
    };
    return this.sendRequest(requestParmams, config);
  }

  postFile(url, params = {}, config = {}) {
    const requestParmams = {
      url: url,
      method: 'post',
      data: {
        getFile: true,
        ...params,
      },
      headers: {
        'content-type': 'application/json',
      },
      responseType: 'blob',
    };
    return this.sendRequest(requestParmams, config).then(res => {
      // 如果是二进制的，则进行下载
      const fileContent = new Blob([res.data]);
      if (res.data.type == 'application/json') {
        const reader = new FileReader();
        reader.onload = function () {
          // 读取完成后，尝试解析为JSON
          try {
            const jsonData = JSON.parse(reader.result);
            if (jsonData.code != 200) {
              message.error(jsonData.message || '请求错误，请联系管理员');
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        };
        reader.readAsText(fileContent); // 读取Blob内容为文本
        return;
      }

      const link = document.createElement('a'); // a标签下载
      link.href = window.URL.createObjectURL(fileContent);
      const fileName = getFileName(res.headers['content-disposition']);
      const suffixName = '.' + fileName.split('.').pop().toLowerCase();
      link.download = `${params.fileName ? params.fileName + suffixName : fileName}`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  }

  // 基类方法
  sendRequest(params, config = {}) {
    const url = this.baseURL + params.url;
    const defaultOptions = {
      loading: true, // 是否显示loadding,默认否
      notNeedMessage: false, // 是否显示当res.status != 1时的showToast，默认：显示
    };
    Object.assign(params, this.config, defaultOptions, config, {
      url,
    });
    if (params.loading) {
      loadingHandle.add();
    }
    return new Promise((resolve, reject) => {
      this.baseAxios
        .request(params)
        .then(res => {
          // 成功的请求，但是业务状态码不对

          if (res.request && res.request.responseType) {
            // 如果是文件流，则返回response
            // return res.data;
            resolve(res);
            return;
          }
          if (res.code != 200 && res.code != 2000) {
            if (res.code == 401) {
              storage.remove(SAVE_TOKEN);
              message.error('登录失效');
              router.push('/login');
            } else if (res.code !== 402 && !params.notNeedMessage) {
              message.error(res.message || '请求错误，请联系管理员');
            }
            reject(res);
          }
          // if (res.request.responseType) {
          //   // 如果是文件流，则返回response
          //   // return res.data;
          //   resolve(res.data);
          // }
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
        .finally(() => {
          if (params.loading) {
            loadingHandle.subtract();
          }
        });
    });
  }
}

export { http, BaseRequest };
// export default new BaseRequest();
