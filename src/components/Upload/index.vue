<template>
  <div>
    <a-upload
      :list-type="listType"
      v-bind="{ ...props, ...$attrs }"
      v-model:file-list="fileList"
      :before-upload="beforeUpload"
      @remove="finishUpload"
      :custom-request="customRequest"
      @preview="previewFile"
    >
      <!-- //达到限制数量和正在上传中不显示上传按钮 -->
      <div v-if="(multiple ? fileList.length < fileNum && !curUploadNum : !fileList.length) || alwaysShowBtn">
        <slot>
          <template v-if="listType === 'picture-card'">
            <PlusOutlined />
            <div class="ant-upload-text">上传</div>
          </template>
          <a-button type="primary" v-else>选择文件</a-button>
        </slot>
      </div>
    </a-upload>
  </div>
</template>

<script setup name="FormUpload">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { postFileUpload } from '@/api/common';

const props = defineProps({
  listType: {
    type: String,
    default: undefined,
  },
  // 按钮名字
  labelName: {
    type: String,
    default: '选择文件',
  },
  fileType: {
    // 文件上传数量
    default: 4, // 文件关联类型,1：图片，2：视频，3：音频，4：其他
    type: Number,
  },
  fileNum: {
    // 文件上传数量
    default: 5,
    type: Number,
  },
  limitSize: {
    // 文件限制大小
    default: 100,
    type: Number,
  },
  accept: {
    // 文件限制格式
    type: String,
    default: '',
  },
  defaultValue: {
    type: [Array, Object],
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  alwaysShowBtn: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  setFileList(props.defaultValue);
});

const previewFile = () => {
  return false;
};

// 正在上传的数量
const curUploadNum = ref(0);
const emit = defineEmits(['change']);
const fileList = ref([]);

// 上传拦截
function beforeUpload(file) {
  let size = file.size / 1024 / 1024;
  if (size > props.limitSize) {
    setTimeout(() => fileList.value.pop());
    message.error('上传文件大小不超过' + props.limitSize + 'M！');
    return false;
  }

  // if (props.accept) {
  //   let suffix = file.name.substring(file.name.lastIndexOf('.') + 1); // txt
  //   if (!props.accept.includes(suffix)) {
  //     setTimeout(() => fileList.value.pop());
  //     message.error('文件格式不正确！');
  //     return false;
  //   }
  //   return true;
  // }

  return true;
}

// 自定义上传
function customRequest(options) {
  // 如果限制了上传数量，去除超过数量的文件
  if (props.multiple) {
    let curIndex = fileList.value.findIndex(item => {
      return item.uid === options?.file?.uid;
    });

    if (curIndex >= props.fileNum) {
      fileList.value.splice(curIndex, 1);
      return;
    }
  }
  let formData = new FormData();
  formData.append('file', options.file);
  formData.append('thumbnailFlag', false);
  formData.append('fileType', props.fileType);
  let progress = { percent: 0 };
  curUploadNum.value += 1;
  postFileUpload(formData, {
    // `onUploadProgress` 允许为上传处理进度事件
    onUploadProgress: function (progressEvent) {
      progress.percent = (progressEvent.loaded / progressEvent.total) * 100;
      options.onProgress(progress);
    },
    loading: false,
  })
    .then(res => {
      let { data } = res;
      let currentIndex = fileList.value.findIndex(item => {
        return item.uid === options.file.uid;
      });
      options.onSuccess();
      fileList.value[currentIndex].fileId = data.id;
      fileList.value[currentIndex].url = data.url;
      fileList.value[currentIndex].name = fileList.value[currentIndex].fileName = data.fileName;
    })
    .catch(() => {
      // let currentIndex = fileList.value.findIndex((item)=>{
      //   return item.uid == options.file.uid;
      // });
      // fileList.value.splice(currentIndex, 1);
      options.onError();
    })
    .finally(() => {
      curUploadNum.value -= 1;
      finishUpload();
    });

  // }
}
// 完成上传动作
function finishUpload() {
  setTimeout(() => {
    emit(
      'change',
      fileList.value
        .filter(t => t.status === 'done')
        .map(o => ({
          fileId: o.fileId,
          url: o.url,
          name: o.name,
        })),
    );
  }, 0);
}

function setFileList(files) {
  fileList.value = (files || []).map(o => ({
    uid: o.id,
    fileId: o.id,
    url: o.url,
    name: o.name,
    status: 'done',
  }));
}

defineExpose({
  setFileList,
});
</script>

<style scoped lang="less">
.tips {
  //margin-bottom: 24px;
  color: #999;
}
</style>
