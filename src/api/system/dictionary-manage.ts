import { serverOrganization, serverBase } from '@/axios';

// -------------- 字典管理

// 字典列表-分页查询
export const postDictTypePage = (data = {}) => serverOrganization.post('/dict/type/v1/page', data, { loading: true });

// 字典列表-更新
export const postDictTypeUpdate = (data = {}) =>
  serverOrganization.post('/dict/type/v1/update', data, { loading: true });

// 字典列表-删除
export const postDictTypeDelete = (data = {}) =>
  serverOrganization.post('/dict/type/v1/delete', data, { loading: true });

// 字典列表-添加
export const postDictTypeAdd = (data = {}) => serverOrganization.post('/dict/type/v1/add', data, { loading: true });

// 字典列表-详情
export const postDictTypeDetail = (data = {}) =>
  serverOrganization.post('/dict/type/v1/detail', data, { loading: true });

// 字典列表-列表
export const postDictTypeList = (data = {}) => serverOrganization.post('/dict/type/v1/list', data, { loading: true });

// 字典子类列表-分页查询
export const postDictItemPage = (data = {}) => serverOrganization.post('/dict/item/v1/page', data, { loading: true });

// 字典子类列表-更新
export const postDictItemUpdate = (data = {}) =>
  serverOrganization.post('/dict/item/v1/update', data, { loading: true });

// 字典子类列表-删除
export const postDictItemDelete = (data = {}) =>
  serverOrganization.post('/dict/item/v1/delete', data, { loading: true });

// 字典子类列表-添加
export const postDictItemAdd = (data = {}) => serverOrganization.post('/dict/item/v1/add', data, { loading: true });

// 字典子类列表-详情
export const postDictItemDetail = (data = {}) =>
  serverOrganization.post('/dict/item/v1/detail', data, { loading: true });

// 根据一级的类型 获取所有的字典值
// data参数-重要：dictType: 一级的类型  itemStatus: 字典数据状态 1：启用 -1：停用
// export const postDictItemsAll = (data = {}) => serverBase.post('/portal/sys/dict_item/query/items', data, { loading: true });
export const postDictItemsAll = (data = {}) =>
  serverBase.post('/portal/sys/dict_item/query/items', data, { loading: true });
