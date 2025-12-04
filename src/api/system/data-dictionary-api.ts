import { serverBase } from '@/axios';

/**
 * 字典类型分页
 * @param data
 */
export const queryDictTypePage = (data = {}) =>
  serverBase.post('/portal/sys/dict_type/query/page', data, { loading: true });

/**
 * 字典类型 新增
 * @param data
 */
export const addDictType = (data = {}) =>
  serverBase.post('/portal/sys/dict_type/add', data, { loading: true }).then(result => result);

/**
 * 字典类型 删除
 * @param data
 */
export const delDictType = (data = {}) =>
  serverBase.post('/portal/sys/dict_type/delete', data, { loading: true }).then(result => result);

/**
 * 字典类型 更新
 * @param data
 */
export const updateDictType = (data = {}) =>
  serverBase.post('/portal/sys/dict_type/update', data, { loading: true }).then(result => result);

/**
 * 字典类型 子字典分页
 * @param data
 */
export const queryDictTypeChildPage = (data = {}) =>
  serverBase.post('/portal/sys/dict_item/query/page', data, { loading: true }).then(result => result);

/**
 * 字典类型 子字典 新增
 * @param data
 */
export const addDictTypeChild = (data = {}) =>
  serverBase.post('/portal/sys/dict_item/add', data, { loading: true }).then(result => result);

/**
 * 字典类型 子字典 删除
 * @param data
 */
export const delDictTypeChild = (data = {}) =>
  serverBase.post('/portal/sys/dict_item/delete', data, { loading: true }).then(result => result);

/**
 * 字典类型 子字典 更新
 * @param data
 */
export const updateDictTypeChild = (data = {}) =>
  serverBase.post('/portal/sys/dict_item/update', data, { loading: true }).then(result => result);

/**
 * 获取指定字典类型下的所有字典数据
 * @param data
 */
export const queryDictItemList = (data = {}) =>
  serverBase.post('/portal/sys/dict_item/query/items', data, { loading: false });
