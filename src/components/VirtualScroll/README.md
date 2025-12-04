# VScroll 虚拟滚动组件说明

## 封装说明



## 例子
（基础使用）
```vue
<template>
  <Divider>基础滚动示例</Divider>
    <div class="virtual-scroll-demo-wrap">
      <VirtualScroll :itemHeight="41" :items="data" :height="300" :width="300">
        <template v-slot="{ item }">
          <div class="virtual-scroll-demo__item">{{ item.title }}</div>
        </template>
      </VirtualScroll>
    </div>

    <Divider>即使不可见，也预先加载50条数据，防止空白</Divider>
    <div class="virtual-scroll-demo-wrap">
      <VirtualScroll :itemHeight="41" :items="data" :height="300" :width="300" :bench="50">
        <template v-slot="{ item }">
          <div class="virtual-scroll-demo__item">{{ item.title }}</div>
        </template>
      </VirtualScroll>
    </div>
</template>

<script setup>
// 组件
import { VirtualScroll } from '@/components/VirtualScroll/index';

 const data = (() => {
    const arr = [];
    for (let index = 1; index < 20000; index++) {
      arr.push({
        title: '列表项' + index,
      });
    }
    return arr;
  })();

</script>

```
## 内置方法




## 内置属性

> 除去 `a-table` 自带属性外，还而外提供了一些额外属性属性

| 属性           | 说明                                             类型                      默认值
| -------------- | ----------------------------------------------------------------------------------
| apiFetch       | 后端列表接口请求                                  [function, promise]        null
| queryParams    | 额外查询条件                                      object                     null
| immediate      | 初始页面是否调用接口                              boolean                    true
| canResize      | 是否自动计算表格高度                              boolean                    true


## 注意事项



## 更新时间

该文档最后更新于： 2022/9/16
