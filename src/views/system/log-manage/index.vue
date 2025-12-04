<template>
  <MainContent>
    <template #title>日志管理</template>
    <template #subTitle>
      <a-space :size="16">
        <template v-for="item in LOG_TYPE" :key="item.value">
          <a-tag
            class="no-border cursor-pointer"
            :class="activeKey === item.value ? '' : 'tag-default'"
            :color="activeKey === item.value ? 'processing' : ''"
            @click="activeKey = item.value"
          >
            {{ item.label }}
          </a-tag>
        </template>
      </a-space>
    </template>
    <template #table>
      <template v-for="item in LOG_TYPE" :key="item.value">
        <component :is="item.component" :type="item.value" v-if="activeKey === item.value"></component>
      </template>
    </template>
  </MainContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MainContent from '@/components/main-content/index.vue';
import OperationLog from './operation-log.vue';
import ErrorLog from './error-log.vue';
import LoginLog from './login-log.vue';
import AuthLog from './auth-log.vue';
import { IDictType } from '@/types';

interface IDictType_ extends IDictType {
  component?: any;
}

const activeKey = ref<string>('1');
const LOG_TYPE: IDictType_[] = [
  {
    label: '操作日志',
    value: '1',
    component: OperationLog,
  },
  {
    label: '登录日志',
    value: '2',
    component: LoginLog,
  },
  {
    label: '错误日志',
    value: '3',
    component: ErrorLog,
  },
  {
    label: 'CA认证日志',
    value: '4',
    component: AuthLog,
  },
];
</script>

<style scoped lang="less"></style>
