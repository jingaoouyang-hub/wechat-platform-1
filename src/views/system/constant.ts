import { green, red } from '@/setting/color-map';
/**
 * @Description: 系统管理
 */
// -------------------权限管理
export const DATA_AUTH = [
  { value: 0, label: '全部数据权限' },
  { value: 1, label: '本部门数据权限' },
  { value: 2, label: '本部门及子部门数据权限' },
  { value: 3, label: '仅本人数据权限' },
  { value: 4, label: '自定义部门数据' },
];

//  角色类型
export const ROLE_TYPE = [
  { value: 1, label: 'Web角色' },
  { value: 2, label: '租户角色' },
];
// export const ROLE_TYPE = {
//   web: 1, // Web角色
//   tenant: 2, // 租户角色
// };

// -------------------流程管理
// 业务名称
export const BIND_BUSINESS = [{ value: 'MATERIAL_APPLICATION', label: '病案上报审批' }];

// 审批类型
export const SIGN_TYPE = [
  { value: 2, label: '或签(一名负责人通过或拒绝即可)' },
  { value: 1, label: '会签(需所有负责人通过)' },
];

// 审批人类型
export const APPROVER_TYPE = [
  { value: 1, label: '指定成员' },
  { value: 2, label: '指定角色' },
  { value: 3, label: '指定部门' },
  { value: 4, label: '系统自动通过' },
];

// --------------------组织架构

// 性别
export const SEX_TYPE = [
  { value: 0, label: '女' },
  { value: 1, label: '男' },
];

// 员工类型
export const EMPLOYEE_TYPE = [
  { value: 0, label: '全职' },
  { value: 1, label: '兼职' },
  { value: 2, label: '实习' },
  { value: 3, label: '劳务派遣' },
  { value: 4, label: '劳务外包' },
  { value: 5, label: '其他' },
];

// --------------------租户管理
// 所属行业
export const INDUSTRY_TYPE = [
  { value: 1, label: '农、林、牧、渔业' },
  { value: 2, label: '采矿业' },
  { value: 3, label: '制造业' },
  { value: 4, label: '电力、热力、燃气及水生产和供应业' },
  { value: 5, label: '建筑业' },
  { value: 6, label: '批发和零售业' },
  { value: 7, label: '交通运输、仓储和邮政业' },
  { value: 8, label: '住宿和餐饮业' },
  { value: 9, label: '信息传输、软件和信息技术服务业' },
  { value: 10, label: '金融业' },
  { value: 11, label: '房地产业' },
  { value: 12, label: '租赁和商务服务业' },
  { value: 13, label: '科学研究和技术服务业' },
  { value: 14, label: '水利、环境和公共设施管理业' },
  { value: 15, label: '居民服务、修理和其他服务业' },
  { value: 16, label: '教育' },
  { value: 17, label: '卫生和社会工作' },
  { value: 18, label: '文化、体育和娱乐业' },
  { value: 19, label: '公共管理、社会保障和社会组织' },
  { value: 20, label: '国际组织' },
];

// 企业规模
export const ENTERPRISE_SIZE = [
  { value: 0, label: '特大型' },
  { value: 1, label: '大型' },
  { value: 2, label: '中型' },
  { value: 3, label: '小型' },
  { value: 4, label: '微型' },
];
// 是、否
export const YES_NO = [
  { value: true, label: '是' },
  { value: false, label: '否' },
];
// 经营状态
export const OPERATING_STATUS = [
  { value: 0, label: '营业' },
  { value: 1, label: '停业' },
  { value: 2, label: '关闭' },
  { value: 3, label: '筹建' },
  { value: 4, label: '其它' },
];

export const ON_JOB_STATUS = [
  { value: 1, label: '在职' },
  { value: 2, label: '离职' },
];
// 离职原因
export const RESIGNATION_REASON = [
  { value: 0, label: '个人原因' },
  { value: 1, label: '家庭原因' },
  { value: 2, label: '发展原因' },
  { value: 3, label: '合同到期不续签' },
  { value: 4, label: '无法胜任' },
  { value: 5, label: '裁员' },
  { value: 6, label: '违法乱纪' },
  { value: 7, label: '其他原因' },
];

// 角色标签
export const ROLE_LABEL = [
  { value: 0, label: '负责人' },
  { value: 1, label: '普通员工' },
];

// --------------------功能配置
// 业主功能配置 -- 绑定角色
export const BIND_ROLE = [{ value: 1, label: '平台管理员' }];
// 业主功能配置 -- 状态
export const CONFING_STATUS = [
  { value: 1, label: '启用', color: green },
  { value: 2, label: '禁用', color: red },
];

// --------------------字典管理
// 字典状态
export const DICT_STATUS = [
  { value: 1, label: '启用', color: green },
  { value: -1, label: '停用', color: red },
];

export const DEPARTMENT_TYPE = [
  { value: 0, label: '管理' },
  { value: 1, label: '临床' },
  { value: 2, label: '医技' },
  { value: 3, label: '其他' },
];

export const ORG_TYPE = [
  { value: 0, label: '西医' },
  { value: 1, label: '中医' },
];

export const ORG_SORT = [
  { value: 0, label: '二级' },
  { value: 1, label: '三级' },
];

export const DATA_SWITCH = [
  { value: 0, label: '编码员能看到所有的病案或缺陷' },
  { value: 1, label: '编码员只能看到自己负责的病案或缺陷' },
];

export const BUG_REPORT = [
  { value: 0, label: '有缺陷时允许导出上报' },
  { value: 1, label: '有缺陷时禁止导出上报' },
];

export const DATA_TEMPLATE = [
  { value: 0, label: '竖表' },
  { value: 1, label: '横表' },
];

export const TARGET_UPDATE = [
  { value: 0, label: '可修改' },
  { value: 1, label: '不可修改' },
];
