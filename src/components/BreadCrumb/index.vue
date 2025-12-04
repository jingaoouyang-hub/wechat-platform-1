/** * @Description: * @author 赵文龙 * @date $ */
<template>
  <div class="flex-start pl-24 py-10">
    <a-button class="left-btn" @click="$router.go(-1)">
      <template #icon>
        <LeftOutlined class="left-icon" />
      </template>
    </a-button>
    <a-breadcrumb class="breadcrumb">
      <template v-for="(item, index) in breadList" :key="index">
        <a-breadcrumb-item v-if="!item.meta.hideBreadcrumb" @click="breadcrumbClick(item, index)">
          <span>{{ item.meta.title }}</span>
        </a-breadcrumb-item>
      </template>
    </a-breadcrumb>
  </div>
</template>
<script setup name="RouteCacheTab">
import { LeftOutlined } from '@ant-design/icons-vue';

const menuList = computed(() => []);
const router = useRouter();
const breadList = computed(() => {
  let matched = router.currentRoute.value.matched.filter(item => {
    return item.path != '/';
  });
  return matched;
});

function breadcrumbClick(item, index) {
  if (breadList.value.length - 1 == index) {
    return;
  }
  filterMenu(menuList.value, item.name);
}

const handleFirstMenu = datas => {
  for (let i = 0; i < datas.length; i++) {
    let item = datas[i];
    if (item.children && item.children.length) {
      handleFirstMenu(item.children);
      return;
    } else {
      if (!item.meta.hidden) {
        router.push({ name: item.name });
        return;
      }
    }
  }
};

const filterMenu = (datas, name) => {
  let currentTree = [];
  for (let i = 0; i < datas.length; i++) {
    let item = datas[i];
    if (item.name == name) {
      currentTree = item.children;
      handleFirstMenu(currentTree);
      break;
    }
    if (item.children && item.children.length) {
      currentTree = filterMenu(item.children, name);
    }
  }
  return currentTree;
};
</script>

<style scoped lang="less">
.left-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  .left-icon {
    font-size: 12px;
  }
}
.breadcrumb {
  position: relative;
  padding: 10px 16px 10px 16px;
  :deep(.ant-breadcrumb-link) {
    &:hover {
      cursor: pointer;
      span {
        color: #1890ff;
      }
    }
  }
}

.route-tab {
  :deep(.ant-tabs-bar) {
    margin: 8px 0px;
    padding: 0 16px;
  }
  // :deep(.ant-tabs-tab){
  //   // background: #FAFAFA !important;
  // }
  // .ant-tabs.ant-tabs-card .ant-tabs-card-bar
  // :deep(.ant-tabs-card) {
  //   .ant-tabs-bar {
  //     margin-bottom: 0px !important;
  //   }
  //   .ant-tabs-card {
  //     background: #ffffff;
  //   }
  //   .ant-tabs-tab {
  //     height: 32px;
  //     line-height: 32px;
  //     margin-right: 0;
  //     border: none;
  //     border-bottom: 1px solid #f0f0f0;
  //     border-right: 1px solid #f0f0f0;
  //     > div {
  //       font-size: 12px;
  //     }
  //   }
  //   .ant-tabs-tab-active {
  //     border-bottom: 1px solid #fff !important;
  //   }
  //   .ant-tabs-nav-container {
  //     height: 32px;
  //   }
  // }
}
</style>
