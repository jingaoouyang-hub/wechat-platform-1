# Table 重封装组件说明

## 封装说明

> 基础的使用方式与 API 与 [官方版(Table)](https://www.antdv.com/components/table-cn) 本一致，在其基础上，封装了加载数据的方法和自动计算表格方法。
>
> 你无需在你是用表格的页面进行分页逻辑处理，仅需向 Table 组件传递绑定 `:api-fetch="Promise"` 对象即可

## 例子
（基础使用）
```vue
<template>
  <BasicTable :query-params="formState" :columns="columns" :api-fetch="getDataSourceListAPI" @register="registerTable">
    <template #operation>
      <a>添加</a>
      <a-divider type="vertical" />
      <a>删除</a>
    </template>
  </BasicTable>
</template>

<script setup>
// 组件
import { BasicTable, useTable } from '@/components/BasicTable';

//api
import { getDataSourceListAPI } from '@/api/data-service/data-manage';

//表格注册方法
const [registerTable, { reloadTable, fetch }] = useTable() as any;
let formState = ref({})
const  columns = [
  {
    title: '字段名称',
    dataIndex: 'fieldName',
  },
  {
    title: '字段类型',
    dataIndex: 'fieldType',
  },
  {
    title: '字段描述',
    dataIndex: 'fieldDesc',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    slots: { customRender: 'operation' },
  }
]
</script>

```
## 内置方法

1、通过 `reloadTable` 调用
`reloadTable` 重载列表数据重置为第一页，也可以自定义传参

2、通过 `fetch` 调用
`fetch` 刷新列表数据，当前参数不变，刷新当前页。也可以自定义传参

3、通过 `redoHeight` 调用
`redoHeight` 重新计算表格高度

4、通过 `setProps` 调用
`setProps` 覆盖props属性



## 内置属性

> 除去 `a-table` 自带属性外，还而外提供了一些额外属性属性

| 属性           | 说明                                             类型                      默认值
| -------------- | ----------------------------------------------------------------------------------
| apiFetch       | 后端列表接口请求                                  [function, promise]        null
| queryParams    | 额外查询条件                                      object                     null
| immediate      | 初始页面是否调用接口                              boolean                    true
| canResize      | 是否自动计算表格高度                              boolean                    true


## 注意事项

> 你可能需要为了与后端提供的接口返回结果一致而去修改以下代码： (需要注意的是，这里的修改是全局性的，意味着整个项目所有使用该 table 组件都需要遵守这个返回结果定义的字段。)


## 更新时间

该文档最后更新于： 2022/8/1
