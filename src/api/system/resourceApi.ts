import { serverUser } from '@/axios';

/**
 * 查询资源菜单
 * @param data
 * @returns {Promise<void>}
 */
export const postResourceMenuByChildren = (data = {}) =>
  serverUser.post('/res/module/query/children', data, { loading: true });

/**
 * 查询资源模块树
 * @param data
 * @returns {Promise<void>}
 */
export const postAllTree = (data = {}) => serverUser.post('/res/module/query/tree', data);

/**
 * 添加模块资源
 * @param data
 * @returns {Promise<void>}
 */
export const postAddResourceModule = (data = {}) => serverUser.post('/res/module/add', data);

/**
 * 编辑模块资源
 * @param data
 * @returns {Promise<void>}
 */
export const postUpdateResourceModule = (data = {}) => serverUser.post('/res/module/update', data);

/**
 * 删除模块资源
 * @param data
 * @returns {Promise<void>}
 */
export const postDeleteResourceModule = (data = {}) => serverUser.post('/res/module/delete', data);

/**
 * 获取模块资源详情
 * @param data
 * @returns {Promise<void>}
 */
export const postResourceModuleDetail = (data = {}) => serverUser.post('/res/module/query/id', data);

/**
 * 添加默认查询权限
 * @param data
 * @returns {Promise<void>}
 */
export const postAddDefaultQuery = (data = {}) => serverUser.post('/sys/res/permission/add/default/query', data);

/**
 * 添加默认编辑权限
 * @param data
 * @returns {Promise<void>}
 */
export const postAddDefaultEdit = (data = {}) => serverUser.post('/sys/res/permission/add/default/edit', data);
