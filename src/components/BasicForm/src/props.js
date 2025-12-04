import { propTypes } from '@/setting/propTypes';

export const basicProps = {
  model: {
    type: Object,
    default: {},
  },
  rowProps: Object,
  baseColProps: {
    type: Object,
  },
  baseRowStyle: {
    type: Object,
  },
  // 标签宽度  固定宽度
  labelWidth: {
    type: [Number, String],
    default: 0,
  },
  layout: propTypes.oneOf(['horizontal', 'vertical', 'inline']).def('horizontal'),
  labelAlign: propTypes.string,
  labelCol: Object,
  wrapperCol: Object,
  colon: propTypes.bool,
  fieldMapToTime: {
    // 举例
    //  fieldMapToTime: [
    //   // data为时间组件在表单内的字段，startTime，endTime为转化后的开始时间于结束时间
    //   // 'YYYY-MM-DD'为时间格式，参考moment
    //   ['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD'],
    //   // 支持多个字段
    //   ['datetime1', ['startTime1', 'endTime1'], 'YYYY-MM-DD HH:mm:ss'],
    // ],
    type: Array,
    default: () => [],
  },
  // 紧凑类型表单，减少 margin-bottom
  compact: propTypes.bool,
  // 表单配置规则
  schemas: {
    type: [Array],
    default: () => [
      // {
      //   field: '', // 字段名
      //   label: '', // 标签名
      //   subLabel: '', // 二级标签名灰色
      //   suffix: '', // 组件后面的内容
      //   changeEvent: '', // 表单更新事件名称
      //   labelWidth: '', // 覆盖统一设置的 labelWidth
      //   disabledLabelWidth: '', // 禁用 form 全局设置的 labelWidth,自己手动设置 labelCol 和 wrapperCol
      //   component: '', // componentMap 引入的组件
      //   componentProps: Object, // 所渲染的组件的 props
      //   rules: [], // 校验规则,见下方 ValidationRule
      //   required: Boolean, // 简化 rules 配置，为 true 则转化成 [{required:true}]。2.4.0之前的版本只支持string类型的值
      //   rulesMessageJoinLabel: Boolean, // 校验信息是否加入 label
      //   itemProps: Object, // 参考 FormItem
      //   colProps: Object, // 参考 col属性
      //   defaultValue: String, // 所渲渲染组件的初始值
      //   render: VNode, // 自定义渲染组件
      //   renderColContent: VNode, // 自定义渲染组件（需要自行包含 formItem）
      //   renderComponentContent: VNode, // 自定义渲染组内部的 slot
      //   slot: String, // 自定义 slot，渲染组件
      //   colSlot: String, // 自定义 slot，渲染组件 （需要自行包含 formItem）
      //   show: String, // 动态判断当前组件是否显示，css 控制，不会删除 dom
      //   ifShow: String, // 动态判断当前组件是否显示，js 控制，会删除 dom
      //   dynamicDisabled: String, // 动态判断当前组件是否禁用
      //   dynamicRules: String, // 动态判返当前组件你校验规则
      // },
    ],
  },
  // 额外传递到子组件的参数 values
  mergeDynamicData: {
    type: Object,
    default: null,
  },
  autoSetPlaceHolder: propTypes.bool.def(true),
  // 在INPUT组件上单击回车时，是否自动提交
  autoSubmitOnEnter: propTypes.bool.def(false),
  submitOnReset: propTypes.bool,
  submitOnChange: propTypes.bool,
  size: propTypes.oneOf(['default', 'small', 'large']).def('default'), // 向表单内所有组件传递 size 参数,自定义组件需自行实现 size 接收
  // 禁用表单
  disabled: propTypes.bool, // 向表单内所有组件传递 disabled 属性，自定义组件需自行实现 disabled 接收
  // 空白行格,可以是数值或者 col 对象 数
  emptySpan: {
    type: [Number, Object],
    default: 0,
  },
  rulesMessageJoinLabel: propTypes.bool.def(true),
  // 是否显示收起展开按钮
  showAdvancedButton: propTypes.bool,
  // 转化时间
  transformDateFunc: {
    type: Function,
    default: date => {
      return date?.format?.('YYYY-MM-DD HH:mm:ss') ?? date;
    },
  },

  // 是否显示操作按钮
  showActionButtonGroup: propTypes.bool.def(true),
  // 操作列Col配置
  actionColOptions: Object,
  // 显示重置按钮
  showResetButton: propTypes.bool.def(true),
  // 是否聚焦第一个输入框，只在第一个表单项为input的时候作用
  autoFocusFirstItem: propTypes.bool,
  // 重置按钮配置
  resetButtonOptions: Object,

  // 显示确认按钮
  showSubmitButton: propTypes.bool.def(true),
  // 确认按钮配置
  submitButtonOptions: Object,

  // 自定义重置函数
  resetFunc: Function,
  submitFunc: Function,

  // 以下为默认props
  hideRequiredMark: propTypes.bool,

  tableAction: {
    type: Object,
  },
};
