const env = import.meta.env.MODE || 'development';
const location = window.location;
// const socketBaseURL = location.protocol === 'http:' ? 'ws://' : 'wss://';

const defaultConfig = {
  asyncRoutes: true, // true：后端动态路由，false本地路由
  socket: 'ws://8.138.16.134:9999/', // websocket地址
  filePreviewAddress: 'http://192.168.0.181:8012/onlinePreview', // 文件预览地址
  fileDownloadMode: 'FILE_A', // 文件下载方式 FILE_A=a标签 FILE_BLOB=文件流
  fileDownloadPath: '/cell-file', // 文件下载前缀 FILE_A需要
};

const configs = {
  development: {
    ...defaultConfig,
  },
  test: {
    ...defaultConfig,
  },
  production: {
    ...defaultConfig,
  },
};
const config = configs[env];
export default config;
