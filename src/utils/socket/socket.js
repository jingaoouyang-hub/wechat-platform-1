import { Socket } from './index';
import { useStoreUser } from '@/store';
import $config from '@/config/index.js';

const wsURL = $config.socket;
window._SOCKET = null;

export function connectSocket() {
  if (!window._SOCKET) {
    const useStore = useStoreUser();
    // appId 为后期扩展加密使用，暂时可以随便填;
    // uid为用户的Id,唯一性的;
    // agentCode为客户端的代码，用于用于可以在多个地方登录，如web,android,ios等
    window._SOCKET = new Socket({
      url: `${wsURL}?Authorization=${useStore.token}`,
      heartMsg: '{"action":"ping"}',
    });
  }
  return window._SOCKET;
}

export function closeSocket() {
  if (window._SOCKET) {
    window._SOCKET.destroy();
    window._SOCKET = null;
  }
}

// export default socket;
