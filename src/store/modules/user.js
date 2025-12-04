import { defineStore } from 'pinia';
import { SAVE_TOKEN, USERINFO, SAVE_RSA_KEY } from '../mutation-types';
import { getStore, setStore, removeStore } from '@/utils/stroge';
import { login, postLogout, userInfo } from '@/api/userCenter';
import { closeSocket, connectSocket } from '@/utils/socket/socket';
import { notification } from 'ant-design-vue';
// 仓库数据

export const useStoreUser = defineStore('user', () => {
  const state = reactive({
    token: getStore(SAVE_TOKEN) || null, // token
    userInfo: getStore(USERINFO) || {}, // token, // 用户等信息
    rsaKey: getStore(SAVE_RSA_KEY) || '',
  });

  // 权限仓库

  // 用户登录
  const userLogin = async params => {
    const response = await login(params);
    const accessToken = response?.data?.token;
    if (accessToken) {
      state.token = accessToken;
      setStore(SAVE_TOKEN, accessToken);
      setStore('IS_SSO', false);
      return true;
    }
    return false;
  };
  // 获取用户信息
  const getUserInfo = () => {
    return userInfo().then(result => {
      state.userInfo = result.data || null;
      setStore(USERINFO, result.data);
      const socket = connectSocket();
      socket.ws.addEventListener('error', () => {
        notification['error']({
          message: '连接失败',
          description: 'websocket连接错误！',
        });
      });
      socket.ws.addEventListener('message', value => {
        try {
          const data = JSON.parse(value.data);
          if (data.status == 1) {
            notification['success']({
              message: '消息通知',
              description: data.message,
            });
          }
          if (['killConnection'].includes(data.action)) {
            notification['error']({
              message: '连接失败',
              description: 'websocket连接错误！',
            });
            closeSocket();
          }
        } catch (e) {}
      });
    });
  };
  // 设置用户信息
  const setUserInfo = params => {
    state.userInfo = Object.assign(state.userInfo, params || {});
  };
  // 登出
  const logout = () => {
    return new Promise(resolve => {
      postLogout()
        .then(() => {
          state.userInfo = {};
          removeStore(SAVE_TOKEN);
          resolve();
        })
        .catch(err => {
          console.log(err);
          // resolve()
        });
    });
  };
  return {
    userLogin,
    logout,
    setUserInfo,
    getUserInfo,
    ...toRefs(state),
  };
});
