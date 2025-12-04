# 搜索表单 展开收起伸缩组件说明

## 封装说明

> 封装了搜索展开收起表单组件，内涵展开收起和不同屏幕下显示不同的个数，和重置搜索功能
>
> 你无需再对搜索表单处理展开收起和屏幕大小展示不同个数写逻辑，只需把当前组件当作 a-form（https://www.antdv.com/components/form-cn）组件使用

## 例子

（结合表格基础使用）

```vue
<template>
  <!-- 优先使用options -->
  <QueryFilter :options="options" :form-model="formState" style="margin-bottom: 24px" @reset="reloadTable" @submit="reloadTable">
    <a-form-item name="name" label="姓名" :max-length="30">
      <a-input v-model:value="formState.name" placeholder="请输入姓名" />
    </a-form-item>
    <a-form-item name="age" label="年龄" :max-length="30">
      <a-input v-model:value="formState.name" placeholder="请输入年龄" />
    </a-form-item>
    <a-form-item label="状态" name="status">
      <a-select v-model:value="formState.status" placeholder="请选择" allow-clear>
        <a-select-option :value="0">停用</a-select-option>
        <a-select-option :value="1">开启</a-select-option>
        <a-select-option :value="2">过期</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item :col-size="2" label="创建时间" name="date">
      <a-range-picker v-model:value="formState.date" />
    </a-form-item>
  </QueryFilter>

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
import QueryFilter from '@/components/QueryFilter/index.jsx';
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

// QueryFilter支持传入配置options，根据component渲染不同数据，也支持插槽模式
const options = [
  {
    field: 'userName',
    component: 'Input',
    label: '账号',
  },
  {
    field: 'selectValue',
    component: 'Select',
    label: '选择框',
    componentProps: {
      options: [{label: '选择框1', value: 1}, {label: '选择框2', value: 2}],
    },
  },
  {
    field: 'datetime',
    component: 'DatePicker',
    label: '时间',
  },
  {
    field: 'datetimeRange',
    component: 'RangePicker',
    fieldToTime: [['startTime', 'endTime']],
    label: '时间范围',
  },
  {
    field: 'realName',
    component: 'Input',
    label: '姓名',
  },
  {
    field: 'phoneNumber',
    component: 'Input',
    label: '绑定手机',
    placeholder: '请输入绑定手机',

  },
];
</script>
```


## QueryFilter内置方法

1、通过 `onCollapsed` 调用 `onCollapsed` 展开收起的回调，返回当前搜索表单的展开收起状态

2、通过 `resetForm` 调用 `resetForm` 重置表单，将数据初始化刚开始状态，返回当前表单数据

3、通过 `onSubmit` 调用 `onSubmit`  提交表单，返回当前表单数据



## 内置属性

> 具体参考queryFilter props有详细说明



## 更新时间

该文档最后更新于： 2022/8/1
