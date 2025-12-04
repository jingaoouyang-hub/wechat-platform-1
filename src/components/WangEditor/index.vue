<template>
  <template v-if="!look">
    <a-spin :spinning="loading" :tip="uploadProgress">
      <div :class="[border ? 'border' : '']">
        <!--上传按钮 不可删！！！-->
        <div v-show="false">
          <button ref="btnFileRef"></button>
        </div>
        <!--上传按钮 不可删！！！ end-->
        <Toolbar class="toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
        <Editor
          :style="{
            height: `${typeof contentHeight === 'number' ? contentHeight + 'px' : contentHeight}`,
            overflowY: 'hidden',
          }"
          v-model="valueHtml"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
          @onChange="handleChange"
          @customPaste="customPaste"
        />
      </div>
    </a-spin>
  </template>
  <template v-else>
    <div class="border">
      <Editor
        :style="{
          height: `${typeof contentHeight === 'number' ? contentHeight + 'px' : contentHeight}`,
          width: '100%',
          overflow: 'auto',
          padding: '10px',
        }"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
      />
    </div>
    <!--<div class="border">
      <div
        :style="{
          height: `${typeof contentHeight === 'number' ? contentHeight + 'px' : contentHeight}`,
          width: '100%',
          overflow: 'auto',
          padding: '10px',
        }"
        v-html="value"
      ></div>
    </div>-->
  </template>
</template>

<script setup lang="ts">
import { IToolbarConfig, IEditorConfig } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { onBeforeUnmount, PropType, ref, shallowRef, watch } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { completeMultipartUpload, createMultipartUpload, uploadFile } from '../../api/common';
import Uploader from 'simple-uploader.js';
import { message } from 'ant-design-vue';

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
   * 工具栏配置
   * @default {IToolbarConfig} {}
   */
  toolbarConfig: {
    type: Object as PropType<Partial<IToolbarConfig>>,
    default: () => {
      return {};
    },
  },
  /**
   * 工具栏配置/编辑器配置 mode字段
   * @default {string} default ,可选 default 或 simple
   */
  mode: {
    type: String as PropType<string>,
    default: 'default',
  },
  /**
   * 编辑器配置
   * @default {IEditorConfig} {}
   */
  editorConfig: {
    type: Object as PropType<Partial<IEditorConfig>>,
    default: () => {
      return {};
    },
  },
  /**
   * 边框
   * @default {boolean} false
   */
  border: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /**
   * 内容区域高度
   * @default {number} 300 | {string} 300px 300%
   */
  contentHeight: {
    type: [Number, String] as PropType<number | string>,
    default: 300,
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

const btnFileRef = ref<HTMLElement>();
const clickTimeId = ref<number>(0);
const loading = ref<boolean>(false);
const uploadProgress = ref<string>('');

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref<string>('');

watch(
  () => props.value,
  () => {
    valueHtml.value = props.value;
  },
);

// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  ...props.toolbarConfig,
};

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      async customUpload(file: File, insertFn: any) {
        loading.value = true;
        let fileBlob = new File([file], file.name, { type: file.type, lastModified: file.lastModified });
        let formData = new FormData();
        formData.append('file', fileBlob);
        const uploadResult = await uploadFile(formData, { loading: false }).catch(() => {
          loading.value = false;
        });
        if (uploadResult) {
          // const { url } = uploadResult.data;
          // insertFn(url, alt, href);
          insertFn(uploadResult.data, '', '');
        }
        loading.value = false;
      },
      onError() {
        message.error('上传失败');
        loading.value = false;
      },
    },
    uploadVideo: {
      customBrowseAndUpload(insertFn: any) {
        const uploaderInit = new Uploader({
          target: (file, chunkFile) => {
            let findResult = file.chunkUrlData?.find(item => {
              return item.index === chunkFile.offset;
            });
            if (findResult) {
              uploadProgress.value = '已上传 ' + (uploaderInit.progress() * 100).toFixed(2) + '%';
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

        uploaderInit.uploader.assignBrowse(btnFileRef.value, false, false, { accept: 'video/*' });

        uploaderInit.on('fileAdded', file => {
          loading.value = true;
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
              insertFn(result.data || '', '');
              loading.value = false;
            })
            .catch(() => {
              loading.value = false;
            });
        });

        uploaderInit.on('fileError', () => {
          message.error('上传错误');
          loading.value = false;
        });

        if (btnFileRef.value) {
          clearTimeout(clickTimeId.value);
          clickTimeId.value = window.setTimeout(() => {
            btnFileRef.value?.click();
          }, 100);
        }
      },
    },
  },
  ...props.editorConfig,
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) {
    return;
  }
  editor.destroy();
});

const handleCreated = (editor): void => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  valueHtml.value = props.value;
  editorRef.value.setHtml(props.value);
};

const handleChange = (): void => {
  // $emit('update:value', valueHtml.value);
  $emit('update:value', editorRef.value.getHtml());
};

// const customPaste = (editor, event) => {
//   const html = event.clipboardData.getData('text/html');
//   // 同步
//   editor.setHtml(html);
//   // 阻止默认的粘贴行为
//   event.preventDefault();
//   return false;
// };
defineExpose({
  editorRef,
  valueHtml,
});
</script>

<style scoped lang="less">
.border {
  border-radius: @border-radius-base;
  border: solid 1px @border-color-base;
  overflow: hidden;
  background-color: #ffffff;
}

.toolbar {
  border-bottom: solid 1px @border-color-base;

  ::v-deep(.w-e-bar-divider) {
    background-color: transparent;
  }
}

::v-deep(.w-e-textarea-video-container) {
  overflow-x: auto;
}

::v-deep(.w-e-drop-panel) {
  max-height: 200px;
  overflow-y: auto;
}
</style>
