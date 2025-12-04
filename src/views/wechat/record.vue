<template>
  <MainContent>
    <template #title>{{ route.query.officialName }}-发布记录</template>
    <template #titleMore>
      <a-space :size="12">
        <a-button @click="router.back()">返回</a-button>
      </a-space>
    </template>
    <template #table>
      <a-table :columns="columns" :dataSource="dataSource" :pagination="false">
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'cover'">
            <a-image :src="record.cover" :width="100" referrerPolicy="no-referrer" />
          </template>
          <template v-if="column.dataIndex === 'link'">
            <a :href="text" target="_blank">{{ text }}</a>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a class="btn" @click="downloadZip(record.link)">下载</a>
          </template>
        </template>
      </a-table>
      <div class="footer-box">
        <a-pagination
          v-model:current="queryData.current"
          v-model:pageSize="queryData.size"
          :total="total"
          :pageSizeOptions="['5']"
          @change="changePageSize"
        />
      </div>
    </template>
  </MainContent>
</template>

<script setup>
import MainContent from '@/components/main-content/index.vue';
import { postAcountPublishRecordList, postMaterialDownload } from '@/api/wechat-manage/index';
import { useCheckWechatLogin } from '@/hooks/useCheckWechatLogin';
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, customRender: record => `${record.index + 1}` },
  { title: '封面图', dataIndex: 'cover', key: 'cover', width: 200, ellipsis: true },
  { title: '标题', dataIndex: 'title', key: 'title', width: 200, ellipsis: true },
  { title: '原文链接', dataIndex: 'link', key: 'link', width: 200, ellipsis: true },
  { title: '发布时间', dataIndex: 'createTime', key: 'createTime', width: 200, ellipsis: true },
  { title: '通知人数', dataIndex: 'sentTotal', key: 'sentTotal', width: 200, ellipsis: true },
  { title: '操作', dataIndex: 'action', key: 'action', width: 100, ellipsis: true },
];
const { qrcodeLogin } = useCheckWechatLogin(() => {
  getList();
});
const route = useRoute();
const router = useRouter();
const queryData = reactive({
  officialName: undefined,
  size: 5,
  current: 1,
});
const total = ref(0);
const dataSource = ref([]);
onActivated(() => {
  queryData.officialName = route.query.officialName;
  getList();
});

const changePageSize = size => {
  queryData.current = size;
  getList();
};

const getList = () => {
  postAcountPublishRecordList(queryData)
    .then(res => {
      dataSource.value = res.data.records;
      total.value = res.data.total;
    })
    .catch(err => {
      if (err.code === -30000 || err.code === 520) {
        qrcodeLogin();
      }
    });
};

const downloadZip = link => {
  postMaterialDownload({ link }).then(res => {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', 'material.zip');
    document.body.appendChild(link);
    link.click();
  });
};
</script>

<style scoped lang="less">
.h-100 {
  ::v-deep .slot-content {
    background-color: #ffffff;
  }
}
.footer-box {
  margin-top: 24px;
  display: flex;
  justify-content: end;
}
</style>
