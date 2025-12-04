import { Heart } from './heart';

import ReconnectingWebsocket from 'reconnecting-websocket';

export class Socket extends Heart {
  ws = null;

  RECONNECT_COUNT = 10; // 变量保存，防止丢失

  OPTIONS = {
    url: '', // 链接的通道的地址
    heartMsg: '{"action":"ping"}', // 心跳信息,默认为'ping'
    reconnectTime: 5000, // 重连时间间隔
    reconnectCount: 3, // 重连次数 -1 则不限制
    openCb: null, // 连接成功的回调
    closeCb: null, // 关闭的回调
    messageCb: null, // 消息的回调
    errorCb: null, // 错误的回调
  };
  constructor(ops) {
    super();
    Object.assign(this.OPTIONS, ops);
    this.create();
  }
  /**
   * 建立连接
   */
  create() {
    if (!('WebSocket' in window)) {
      /* eslint-disable no-new */
      new Error('当前浏览器不支持，无法使用');
      return;
    }
    if (!this.OPTIONS.url) {
      new Error('地址不存在，无法建立通道');
      return;
    }
    delete this.ws;
    // null, {headers: this.OPTIONS.headers}
    // [this.OPTIONS.token]
    this.ws = new ReconnectingWebsocket(this.OPTIONS.url, [], {
      connectionTimeout: this.OPTIONS.reconnectTime,
      maxRetries: this.OPTIONS.reconnectCount,
    });
    // let aaa = new reconnectingWebsocket(this.OPTIONS.url);
    // console.log(reconnectingWebsocket, 'reconnectingWebsocket');
    // console.log(aaa, 'aaa');

    this.onopen();
    this.onclose();
    this.onmessage();
  }
  /**
   * 自定义连接成功事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onopen(callback) {
    this.ws.onopen = event => {
      // 建立心跳机制
      super.reset().start(() => {
        this.send(this.OPTIONS.heartMsg);
      });
      if (typeof callback === 'function') {
        callback(event);
      } else {
        typeof this.OPTIONS.openCb === 'function' && this.OPTIONS.openCb(event);
      }
    };
  }
  /**
   * 自定义关闭事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onclose(callback) {
    this.ws.onclose = event => {
      super.reset();
      if (typeof callback === 'function') {
        callback(event);
      } else {
        typeof this.OPTIONS.closeCb === 'function' && this.OPTIONS.closeCb(event);
      }
    };
  }
  /**
   * 自定义错误事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onerror(callback) {
    this.ws.onerror = event => {
      if (typeof callback === 'function') {
        callback(event);
      } else {
        typeof this.OPTIONS.errorCb === 'function' && this.OPTIONS.errorCb(event);
      }
    };
  }
  /**
   * 自定义消息监听事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onmessage(callback) {
    this.ws.onmessage = event => {
      // 收到任何消息，重新开始倒计时心跳检测
      super.reset().start(() => {
        this.send(this.OPTIONS.heartMsg);
      });
      if (typeof callback === 'function') {
        callback(event.data);
      } else {
        typeof this.OPTIONS.messageCb === 'function' && this.OPTIONS.messageCb(event.data);
      }
    };
  }
  /**
   * 自定义发送消息事件
   * @param {String} data 发送的文本
   */
  send(data) {
    this.ws.send(data);
  }

  close() {
    this.ws.close();
  }
  /**
   * 销毁
   */
  destroy() {
    super.reset();
    this.ws.close();
  }
}
