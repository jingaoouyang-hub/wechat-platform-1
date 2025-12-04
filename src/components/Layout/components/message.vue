<template>
  <div class="message-box">
    <a-popover placement="bottomRight" trigger="hover" overlayClassName="header-message-list">
      <a-badge :count="unReadMsgCount">
        <BellOutlined class="icon" />
      </a-badge>
      <template #content>
        <div class="message-list-box d-flex flex-column">
          <a-space class="d-flex j-sb message-top">
            <div :class="['message-top-item', isAll && 'active', !isLoading && 'no-click']" @click="change(1)">
              全部消息·{{ allNum }}
            </div>
            <div :class="['message-top-item', !isAll && 'active', !isLoading && 'no-click']" @click="change(0)">
              未读消息·{{ noReadNum }}
            </div>
          </a-space>
          <div class="d-flex j-center">
            <a-spin v-if="!isLoading" />
          </div>
          <div class="message-list" v-if="isLoading">
            <template v-for="item in messageList" :key="item.id">
              <div class="message-list-item" @click="handleLook(item)">
                <a-badge :dot="!item.isRead" :offset="[0, 10]" class="mr-10">
                  <!-- <MessageOutlined class="message-icon" /> -->
                </a-badge>
                <div class="message-text">
                  <div class="d-flex j-sb">
                    <span class="font-14 item-content">{{ item.title || '-' }}</span>
                    <div>{{ item.gmtSended }}</div>
                  </div>
                  <div class="line-clamp-2 font-14">{{ item.content }}</div>
                  <!-- <div class="item-label line-height-1">
                    <div class="a-btn" v-if="!item.isRead" @click.stop="handleReadMsg(item)"><a>标为已读</a></div>
                  </div> -->
                </div>
              </div>
            </template>

            <a-empty v-if="isLoading && messageList.length === 0" description="暂无消息" />
          </div>
          <div class="message-list-btn" v-if="!isAll && messageList.length !== 0">
            <div @click.stop="handleReadMsgAll">一键已读</div>
            <!-- <div>
              <a @click.stop="handleLookMsg">查看全部</a>
            </div> -->
          </div>
        </div>
      </template>
    </a-popover>
  </div>
  <DetailPopup ref="detailPopupRef" />
</template>

<script setup>
// 消息列表相关
import { ref, watch, onBeforeUnmount } from 'vue';
import {
  queryPersonalMsgPage,
  queryUnReadMsgCount,
  readPersonalMsg,
  readPersonalMsgAll,
  queryPersonalMsgNum,
} from '../../../api/message';
import { message } from 'ant-design-vue';
import { useStoreApp, useStoreDict } from '@/store';
import DetailPopup from '@/views/flow-manage/instance/detail/index.vue';

const storeApp = useStoreApp();
const storeDict = useStoreDict();
storeDict['initDict'](['MESSAGE_TYPE']);

// const MESSAGE_TYPE_LIST = computed(() => storeDict['dictData']['MESSAGE_TYPE']);

const isAll = ref(0);
const isLoading = ref(false);

const messageList = ref([]);
const getMessageList = () => {
  isLoading.value = false;
  queryPersonalMsgPage(
    {
      current: 1,
      size: 1000,
      read: isAll.value ? undefined : 0,
    },
    {
      loading: false,
    },
  ).then(result => {
    isLoading.value = true;
    messageList.value = result.data.records;
  });
};
const allNum = ref('');
const noReadNum = ref('');
const getMessageNum = () => {
  queryPersonalMsgNum().then(res => {
    allNum.value = res.data.all;
    noReadNum.value = res.data.noRead;
  });
};
getMessageNum();
getMessageList();
const unReadMsgCount = ref(0);
// const getUnReadMsgCount = () => {
//   queryUnReadMsgCount({}, { loading: false }).then(result => {
//     unReadMsgCount.value = Number(result.data);
//   });
// };
// getUnReadMsgCount();

const change = type => {
  isAll.value = type;
  getMessageList();
};
watch(
  () => storeApp['messageKey'],
  () => {
    getMessageList();
    // getUnReadMsgCount();
  },
);
// 消息列表相关 end

// 标为已读
// const handleReadMsg = params => {
//   readPersonalMsg({
//     id: params.id,
//   }).then(() => {
//     params.isRead = true;
//     getUnReadMsgCount();
//     getMessageList();
//     storeApp && storeApp['changeValue']('messagePageKey', storeApp['messagePageKey'] + 1);
//     message.success('操作成功');
//   });
// };
// 标为已读 end

// 全部已读
const handleReadMsgAll = () => {
  readPersonalMsgAll().then(() => {
    message.success('操作成功');
    getMessageList();
    getUnReadMsgCount();
    getMessageNum();
  });
};
// 全部已读 end

// 查看全部
// const router = useRouter();
// 查看全部 end

// 查看相关
const detail = ref({});
const handleLook = params => {
  if (params.isRead) {
    detail.value = { ...params };
    lookType(params);
    return;
  }
  readPersonalMsg({
    id: params.id,
  }).then(() => {
    getUnReadMsgCount();
    params.isRead = true;
    detail.value = { ...params };
    lookType(params);
  });
};

const detailPopupRef = ref();
const lookType = () => {
  // if (detail.value.messageType.toString() === '3') {
  //   detailPopupRef.value.instanceId = detail.value.flowInstId;
  //   detailPopupRef.value.visibleBox = true;
  //   return;
  // }
  // nextTick(() => {
  //   visible.value = true;
  // });
  // router.push({
  //   path: '/config-template-detail',
  //   query: {
  //     id: item.informedConsentId,
  //     projectId: item.projectId,
  //     taskId: item.taskId,
  //     examineId: item.examineId,
  //     type: !!item.taskId,
  //   },
  // });
};
// 查看相关 end

// 全局通知
const handleWSMessage = value => {
  const data = JSON.parse(value.data);
  // 消息通知
  if (['message_notify'].includes(data.action)) {
    getMessageList();
    getUnReadMsgCount();
    getMessageNum();

    // const key = `open${Date.now()}`;
    // notification.open({
    //   message: MESSAGE_TYPE_LIST.value.find(i => i.value === data.ext.messageType.toString()).label || '通知', // data.ext.messageType,
    //   description: data.ext.content,
    //   duration: 6,
    //   btn: () =>
    //     h(
    //       Button,
    //       {
    //         type: 'primary',
    //         size: 'small',
    //         onClick: () => {
    //           handleReadMsg({ id: data.ext.id });
    //           return notification.close(key);
    //         },
    //       },
    //       { default: () => '标为已读' },
    //     ),
    //   key,
    // });
  }
};
window._SOCKET && window._SOCKET.ws.addEventListener('message', handleWSMessage);
onBeforeUnmount(() => {
  window._SOCKET && window._SOCKET.ws.removeEventListener('message', handleWSMessage);
});
// 全局通知 end
</script>

<style scoped lang="less">
.message-box {
  display: flex;
  justify-content: center;
  align-items: center;

  ::v-deep(.ant-badge) {
    .icon {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      font-size: 16px;
      border-radius: 50%;
      background-color: @label-color;
      cursor: pointer;

      &:hover {
        background-color: @light-primary-color;
        color: @primary-color;
      }
    }
  }
}
.no-click {
  pointer-events: none;
}
:deep(.ant-popover-inner-content) {
  padding-left: 0;
  padding-right: 0;
}
</style>
