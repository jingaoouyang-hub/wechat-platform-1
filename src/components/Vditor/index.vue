<template>
  <a-spin :spinning="loading">
    <div :id="domId" :class="look ? 'look' : ''" />
  </a-spin>

  <!--网络资源相关-->
  <a-modal
    destroy-on-close
    width="500px"
    v-model:visible="visible"
    title="添加网络资源"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form ref="formRef" :model="formState" :labelCol="{ style: { width: '90px' } }" autocomplete="off">
      <template v-if="visibleType === 'IMAGE'">
        <a-form-item label="图片地址" name="url" :rules="[{ required: true, message: '请输入图片地址' }]">
          <a-input v-model:value="formState.url" />
        </a-form-item>
        <a-form-item label="图片标题" name="title">
          <a-input v-model:value="formState.title" />
        </a-form-item>
        <a-form-item label="图片描述" name="alt">
          <a-input v-model:value="formState.alt" />
        </a-form-item>
      </template>
      <template v-if="visibleType === 'VIDEO'">
        <a-form-item label="视频地址" name="url" :rules="[{ required: true, message: '请输入视频地址' }]">
          <a-input v-model:value="formState.url" />
        </a-form-item>
        <a-form-item label="视频封面" name="picture">
          <a-input v-model:value="formState.picture" />
        </a-form-item>
      </template>
    </a-form>
  </a-modal>
  <!--网络资源相关 end-->

  <!--自定义上传相关-->
  <input v-show="false" ref="inputImageRef" type="file" accept="image/*" @change="inputChange" />
  <input v-show="false" ref="inputVideoRef" type="file" accept="video/*" @change="inputChange" />
  <!--网络资源相关 end-->
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, PropType, watch } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { v4 as uuidv4 } from 'uuid';
import { FormInstance, message } from 'ant-design-vue';
import { completeMultipartUpload, createMultipartUpload, uploadFile } from '../../api/common';
import Uploader from 'simple-uploader.js';
import { INetworkType, IVisibleType } from './type';

const props = defineProps({
  /**
   * 文本值
   * @default {string} ''
   */
  value: {
    type: String as PropType<string>,
    default: '',
  },

  /**
   * 编辑器高度
   * @default {number} 300 | {string} 300px 300%
   */
  height: {
    type: [Number, String] as PropType<number | string>,
    default: 500,
  },

  /**
   * 查看
   * @default {boolean} false
   */
  look: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const $emit = defineEmits(['update:value']);

const domId: string = uuidv4();
const vditor = ref<Vditor | null>(null);
const loading = ref<boolean>(false);

onMounted(() => {
  vditor.value = new Vditor(domId, {
    mode: 'sv',
    width: '100%', // 编辑器总宽度，支持 %
    height: props.look ? 'auto' : typeof props.height === 'number' ? props.height + 'px' : props.height, // 编辑器总高度
    value: '', // 编辑器初始化值
    toolbar: [
      // 'emoji',
      'headings',
      'bold',
      'italic',
      'strike',
      'link',
      // '|',
      'list',
      'ordered-list',
      'check',
      'outdent',
      'indent',
      // '|',
      'quote',
      'line',
      'code',
      'inline-code',
      'insert-before',
      'insert-after',
      // '|',
      // 'upload',
      {
        name: 'customUploadImage',
        tipPosition: 'n',
        tip: '上传图片',
        icon: '<svg t="1680080069451" class="icon" viewBox="0 0 1192 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13140" xmlns:xlink="http://www.w3.org/1999/xlink" width="18.625" height="16"><path d="M1096.088692 0H95.929047A95.929047 95.929047 0 0 0 0 95.929047v832.141906A95.929047 95.929047 0 0 0 95.929047 1021.72949h1000.159645A95.929047 95.929047 0 0 0 1192.017738 928.070953V95.929047A95.929047 95.929047 0 0 0 1096.088692 0z m-157.232816 517.676275a47.68071 47.68071 0 0 0-56.76275 0l-207.184035 139.636364L380.310421 290.05765a47.68071 47.68071 0 0 0-70.385809 0L95.929047 507.45898V95.929047h1000.159645v487.02439z" fill="#5E5C5C" p-id="13141"></path><path d="M843.494457 194.128603a134.527716 134.527716 0 1 0 134.527716 134.527716 134.527716 134.527716 0 0 0-134.527716-134.527716z m0 170.288248a38.59867 38.59867 0 1 1 38.598669-38.598669 38.59867 38.59867 0 0 1-38.598669 40.869179z" fill="#5E5C5C" p-id="13142"></path></svg>',
        toolbar: [
          {
            name: 'networkImage',
            tip: '网络图片',
            icon: '网络图片',
            click: () => {
              visibleType.value = 'IMAGE';
              visible.value = true;
            },
          },
          {
            name: 'uploadImage',
            tip: '上传图片',
            icon: '上传图片',
            click: () => {
              if (inputImageRef.value) {
                inputImageRef.value.click();
              }
            },
          },
        ],
      },
      {
        name: 'customUploadVideo',
        tipPosition: 'n',
        tip: '上传视频',
        icon: '<svg t="1680080419796" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15052" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><path d="M784 112H240C152 112 80 184 80 272v480c0 88 72 160 160 160h544c88 0 160-72 160-160V272c0-88-72-160-160-160zM144 720V304h736v416H144z m96-544h544c41.6 0 76.8 27.2 89.6 64H150.4c12.8-36.8 48-64 89.6-64z m544 672H240c-41.6 0-76.8-27.2-89.6-64h724.8c-14.4 36.8-49.6 64-91.2 64z" fill="#4A576A" p-id="15053"></path><path d="M628.8 457.6l-131.2-78.4c-9.6-6.4-20.8-9.6-33.6-9.6-35.2 0-64 28.8-64 64V592c0 11.2 3.2 22.4 9.6 33.6 8 14.4 22.4 25.6 40 28.8 4.8 1.6 11.2 1.6 16 1.6 11.2 0 22.4-3.2 33.6-9.6l131.2-78.4c9.6-4.8 16-12.8 22.4-22.4 16-30.4 6.4-70.4-24-88zM595.2 512L464 590.4V432l131.2 80z" p-id="15054"></path></svg>',
        toolbar: [
          {
            name: 'networkVideo',
            icon: '网络视频',
            click: () => {
              visibleType.value = 'VIDEO';
              visible.value = true;
            },
          },
          {
            name: 'uploadVideo',
            icon: '上传视频',
            click: () => {
              if (inputVideoRef.value) {
                inputVideoRef.value.click();
              }
            },
          },
        ],
      },
      // 'record',
      'table',
      // '|',
      'undo',
      'redo',
      // '|',
      'fullscreen',
      'edit-mode',
      {
        name: 'more',
        toolbar: [
          'both',
          'code-theme',
          'content-theme',
          // 'export',
          'outline',
          'preview',
          // 'devtools',
          // 'info',
          // 'help',
        ],
      },
    ],
    toolbarConfig: {
      hide: props.look, // 是否隐藏工具栏
      pin: false, // 是否固定工具栏
    },
    cache: {
      enable: false, // 是否使用 localStorage 进行缓存
    },
    preview: {
      maxWidth: 1920,
      delay: 0,
      hljs: {
        enable: true, // 是否启用代码高亮
        style: 'algol', // 代码高亮样式
      },
      theme: {
        current: 'light', // 当前主题
      },
      actions: [],
    },
    link: {
      isOpen: false, // 是否打开链接地址
    },
    image: {
      isPreview: false, // 是否预览图片
    },
    after: () => {
      vditor.value!.setValue(props.value);
      if (props.look) {
        vditor.value!.vditor?.toolbar?.elements?.preview?.firstElementChild?.dispatchEvent(new CustomEvent('click'));
      }
    },
    input: (value: string) => {
      $emit('update:value', value);
    },
    upload: {
      handler(files: File[]): string | Promise<string> | Promise<null> | null {
        files.forEach(item => {
          judgeFileType(item);
        });
        return null;
      },
    },
  });
});

watch(
  () => props.value,
  () => {
    if (props.look && vditor.value) {
      vditor.value!.setValue(props.value);
    }
  },
);

// 上传图片
const handleUploadImage = async (file: File) => {
  loading.value = true;
  let fileBlob = new File([file], file.name, { type: file.type, lastModified: file.lastModified });
  let formData = new FormData();
  formData.append('file', fileBlob);
  const uploadResult = await uploadFile(formData, { loading: false }).catch(() => {
    loading.value = false;
  });
  if (uploadResult && vditor.value) {
    vditor.value.insertValue(`![](${uploadResult.data} "image")`, true);
  }
  loading.value = false;
};

// 上传视频
const handleUploadVideo = (file: File) => {
  loading.value = true;
  const uploaderInit = new Uploader({
    target: (file, chunkFile) => {
      let findResult = file.chunkUrlData?.find(item => {
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

  uploaderInit.on('fileAdded', file => {
    const fileName = file.name; // 文件名
    const chunkSize = file.chunks.length; // 分片数
    createMultipartUpload({ fileName, chunkSize })
      .then(result => {
        let { chunkList, uploadId } = result.data;
        let chunkListIndexs = chunkList.map(item => {
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
        loading.value = false;
      });
    return true;
  });

  uploaderInit.on('fileSuccess', (rootFile, file) => {
    const params = {
      chunkSize: file.chunkUrlData.length,
      fileName: file.name,
      uploadId: file.uploadId,
    };
    completeMultipartUpload(params)
      .then(result => {
        loading.value = false;
        if (result.data && vditor.value) {
          const type = result.data.substring(result.data.lastIndexOf('.') + 1);
          const html = `&lt;video style="width: 500px; height: 300px; background: #000000;" controls&gt;&lt;source src="${result.data}" type="video/${type}"&gt;&lt;/video&gt;`;
          vditor.value.insertValue(html, true);
        }
      })
      .catch(err => {
        loading.value = false;
        message.error(err);
      });
  });

  uploaderInit.on('fileError', () => {
    loading.value = false;
    message.error('上传错误');
  });

  uploaderInit['addFile'](file);
};

const judgeFileType = (file: File): void => {
  if (!file) {
    message.error('内部错误');
    return;
  }
  const type = file.type?.slice(0, 5);
  if (type === 'image') {
    handleUploadImage(file);
  }
  if (type === 'video') {
    handleUploadVideo(file);
  }
};

// 自定义上传功能
const inputImageRef = ref<HTMLElement>();
const inputVideoRef = ref<HTMLElement>();
const inputChange = (event: Event) => {
  const inputDom = event.target as HTMLInputElement;
  judgeFileType(inputDom!.files![0]);
};

// 网络资源弹窗相关
const visible = ref<boolean>(false);
const visibleType = ref<IVisibleType>('IMAGE');
const formState = ref<INetworkType>({});
const formRef = ref<FormInstance>();
const handleCancel = () => {
  formState.value = {};
  visibleType.value = 'IMAGE';
  visible.value = false;
};
const handleOk = () => {
  if (formRef.value) {
    formRef.value.validate().then(value => {
      if (visibleType.value === 'IMAGE' && vditor.value) {
        vditor.value!.insertValue(`![${value.alt || ''}](${value.url} "${value.title || 'image'}")`, true);
      }
      if (visibleType.value === 'VIDEO') {
        const type = value.url.substring(value.url.lastIndexOf('.') + 1);
        const html = `&lt;video style="width: 500px; height: 300px; background: #000000;" controls poster="${
          value.picture || ''
        }"&gt;&lt;source src="${value.url}" type="video/${type}"&gt;&lt;/video&gt;`;
        vditor.value!.insertValue(html, true);
      }
      handleCancel();
    });
  }
};
// 网络资源弹窗相关 end

onBeforeUnmount(() => {
  if (vditor.value === null) {
    return;
  }
  vditor.value.destroy();
});
</script>

<style scoped lang="less">
.vditor {
  background-color: #ffffff;
  border-radius: @border-radius-base;

  --border-color: @border-color-base;
  --toolbar-background-color: #ffffff;
  --toolbar-icon-color: @heading-color;
  --toolbar-height: 40px;
  --panel-shadow: @box-shadow-base;
  --textarea-background-color: #ffffff;
  --second-color: @disabled-color;
  --toolbar-icon-hover-color: @primary-color;
  --panel-background-color: #ffffff;

  ::v-deep(.vditor-toolbar) {
    padding: 4px !important;

    .vditor-hint {
      button {
        padding: 6px 14px;
        line-height: 2;
        font-size: 14px;
      }
    }

    &.vditor-toolbar--hide {
      padding: 0 !important;
      height: 0;
    }
  }

  ::v-deep(.vditor-toolbar__item) {
    .vditor-tooltipped {
      width: 40px;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  ::v-deep(.vditor-content) {
    .vditor-reset {
      padding: 16px 32px !important;

      > table {
        border: none;
      }
    }

    .vditor-panel {
      opacity: 1;
      padding: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }

  &.look {
    border: none;

    ::v-deep(.vditor-toolbar) {
      border: none;
    }

    ::v-deep(.vditor-content) {
      .vditor-reset {
        padding: 0 !important;
      }

      .vditor-preview {
        border: none;
      }
    }
  }
}
</style>
