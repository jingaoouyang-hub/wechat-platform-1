/**
 * 自定义上传（分片处理）目前只支持单个
 */
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import Uploader from 'simple-uploader.js';
import { completeMultipartUpload, createMultipartUpload } from '@/api/common';

interface IDefaultParamsType {
  // 上传文件类型
  accept?: string;
  // 是否可以多选
  multiple?: boolean;
  /**
   * 错误回调
   * @param {string} moduleName 模块名
   * @param {string} message 错误信息
   * @param {any} data 错误数据
   */
  // eslint-disable-next-line no-unused-vars
  onError?: ({ moduleName, message, data }: { moduleName: string; message: string; data: any }) => void;
  /**
   * 成功回调
   * @param {any} result 接口返回参数
   */
  // eslint-disable-next-line no-unused-vars
  onSucceed?: (result: any) => void;
}

export const useCustomUpload = (params?: IDefaultParamsType) => {
  // 上传加载状态
  const uploadLoading = ref<boolean>(false);
  // 上传实例
  const uploaderInit = ref<any>(false);

  /**
   * 点击触发上传input
   */
  const handleUploadClick = (): void => {
    const dom = document.createElement('input');
    dom.type = 'file';
    dom.accept = (params && params.accept) ?? '*';
    // 不支持
    dom.multiple = (params && params.multiple) ?? false;
    dom.click();
    dom.addEventListener('change', inputChange);
  };

  const inputChange = (event: Event): void => {
    const inputDom = event.target as HTMLInputElement;
    // uploadFun(inputDom!.files![0]);
    addUploadFile(inputDom!.files![0]);
  };

  /**
   * 上传实例方法
   */
  const uploadFun = (): void => {
    uploaderInit.value = new Uploader({
      target: (file, chunkFile) => {
        const findResult = file.chunkUrlData?.find(item => {
          return item.index === chunkFile.offset;
        });
        if (findResult) {
          // '已上传 ' + (uploaderInit.progress() * 100).toFixed(2) + '%';
          return findResult?.link;
        }
      },
      allowDuplicateUploads: true,
      testChunks: false,
      chunkSize: 10 * 1024 * 1024,
      forceChunkSize: true,
      uploadMethod: 'PUT',
      processParams: function () {
        return {};
      },
      method: 'octet',
      maxChunkRetries: 3,
    });

    uploaderInit.value.on('fileAdded', file => {
      const fileName = file.name; // 文件名
      const chunkSize = file.chunks.length; // 分片数
      createMultipartUpload({ fileName, chunkSize }, { loading: false })
        .then(result => {
          const { chunkList, uploadId } = result.data;
          const chunkListIndexs = chunkList.map(item => {
            return item.index;
          });
          if (chunkList && chunkList.length) {
            file.chunks = file.chunks.filter((item, index) => {
              return chunkListIndexs.includes(index);
            });
            file.chunkUrlData = chunkList || [];
            file.uploadId = uploadId;
            file.resume();
          } else {
            file.chunks = [];
            file.error = true;
          }
        })
        .catch(() => {
          uploadLoading.value = false;
          params?.onError?.({
            moduleName: '分片',
            message: '分片接口出错',
            data: null,
          });
        });
      return true;
    });

    uploaderInit.value.on('fileSuccess', (rootFile, file) => {
      completeMultipartUpload(
        {
          chunkSize: file.chunkUrlData.length,
          fileName: file.name,
          uploadId: file.uploadId,
        },
        { loading: false },
      )
        .then(result => {
          uploadLoading.value = false;
          params?.onSucceed?.(result);
        })
        .catch(err => {
          uploadLoading.value = false;
          message.error(err);
          params?.onError?.({
            moduleName: '合并',
            message: '合并接口出错',
            data: null,
          });
        });
    });

    uploaderInit.value.on('fileError', err => {
      uploadLoading.value = false;
      message.error('上传错误');
      params?.onError?.({
        moduleName: 'fileError',
        message: '上传错误',
        data: err,
      });
    });
  };
  uploadFun();

  /**
   * 上传实例添加文件方法，可直接调用传入文件对象即可
   * @param {File} file 文件对象
   */
  const addUploadFile = (file: File): void => {
    if (!file) {
      message.error('内部错误');
      params?.onError?.({
        moduleName: 'inputChange',
        message: '内部错误',
        data: null,
      });
      return;
    }
    uploadLoading.value = true;

    uploaderInit.value['addFile'](file);
  };

  return {
    uploadLoading,
    handleUploadClick,
    addUploadFile,
  };
};
