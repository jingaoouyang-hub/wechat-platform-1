import { postWechatLoginCheck, postWechatLoginQrcode, postWechatLoginStatus } from '@/api/wechat-manage/index';
import { message, Modal } from 'ant-design-vue';
export function useCheckWechatLogin(callback) {
  const startCheck = args => {
    postWechatLoginCheck()
      .then(() => {
        callback(args);
      })
      .catch(() => {
        postWechatLoginQrcode().then(result => {
          const fileContent = new Blob([result.data]);
          Modal.info({
            title: '请扫码登录',
            content: h('img', { src: window.URL.createObjectURL(fileContent), style: 'width: 300px;height: 300px;' }),
            okText: '完成',
            onOk() {
              postWechatLoginStatus()
                .then(() => {
                  callback(args);
                })
                .catch(err => {
                  console.log(err);
                  message.error('请扫码登录');
                });
            },
          });
        });
      });
  };
  const qrcodeLogin = args => {
    postWechatLoginQrcode().then(result => {
      const fileContent = new Blob([result.data]);
      Modal.info({
        title: '请扫码登录',
        content: h('img', { src: window.URL.createObjectURL(fileContent), style: 'width: 300px;height: 300px;' }),
        okText: '完成',
        onOk() {
          postWechatLoginStatus()
            .then(() => {
              callback(args);
            })
            .catch(() => {
              message.error('请扫码登录');
            });
        },
      });
    });
  };
  return {
    startCheck,
    qrcodeLogin,
  };
}
