import { serverUser } from '@/axios';

/**
 * 查询模块权限分页
 * @param data
 * @returns {Promise<void>}
 */
export const postPermissionPage = (data = {}) => serverUser.post('/sys/res/permission/query/page', data);

/**
 * 添加模块权限
 * @param data
 * @returns {Promise<void>}
 */
export const postAddPermission = (data = {}) => serverUser.post('/sys/res/permission/add', data);

/**
 * 删除模块权限
 * @param data
 * @returns {Promise<void>}
 */
export const postDeletePermission = (data = {}) => serverUser.post('/sys/res/permission/delete', data);

/**
 * 根据id查询模块权限
 * @param data
 * @returns {Promise<void>}
 */
export const postPermissionDetail = (data = {}) => serverUser.post('/sys/res/permission/query/id', data);

/**
 * 修改模块权限
 * @param data
 * @returns {Promise<void>}
 */
export const postUpdatePermission = (data = {}) => serverUser.post('/sys/res/permission/update', data);
