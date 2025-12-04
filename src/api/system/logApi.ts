import { serverBase } from '@/axios';

/**
 * 操作日志
 * @param data
 * @returns {Promise<void>}
 */
export const operationLogPage = (data = {}) => serverBase.post('/operation/log/page', data, { loading: true });

/**
 * 登录日志
 * @param data
 * @returns {Promise<void>}
 */
export const loginLogPage = (data = {}) => serverBase.post('/login/log/page', data, { loading: true });

/**
 * 错误日志
 * @param data
 * @returns {Promise<void>}
 */
export const errorLogPage = (data = {}) => serverBase.post('/error/log/query/page', data, { loading: true });
export const errorLogDetail = (data = {}) => serverBase.post('/error/log/query/id', data, { loading: true });

/**
 * 查询操作模块
 * @param data
 * @returns {Promise<void>}
 */
export const operationLogModule = (data = {}) => serverBase.post('/log/const/list/module', data, { loading: true });

/**
 * 查询操作类型
 * @param data
 * @returns {Promise<void>}
 */
export const operationTypeList = (data = {}) =>
  serverBase.post('/log/const/list/operation/type', data, { loading: true });

/**
 * ca认证日志分页
 * @param data
 * @returns {Promise<void>}
 */
export const postCaAuthPage = (data = {}) => serverBase.post('/ca/operation/log/v1/page', data, { loading: true });
