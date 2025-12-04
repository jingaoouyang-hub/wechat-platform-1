import { serverUser } from '@/axios';

/**
 * 添加组织
 * @param data
 * @returns {Promise<void>}
 */
export const postDepartmentAdd = (data = {}) => serverUser.post('/org/add', data);

/**
 * 修改组织
 * @param data
 * @returns {Promise<void>}
 */
export const postDepartmentUpdate = (data = {}) => serverUser.post('/org/update', data);

/**
 * 删除组织
 * @param data
 * @returns {Promise<void>}
 */
export const postDepartmentDelete = (data = {}) => serverUser.post('/org/delete', data);

/**
 * 根据id查询组织
 * @param data
 * @returns {Promise<void>}
 */
export const postDepartmentQuery = (data = {}) => serverUser.post('/org/query/id', data);

/**
 * 组织分页
 * @param data
 * @returns {Promise<void>}
 */
export const postDepartmentPage = (data = {}) => serverUser.post('/org/query/tree/all', data);

/**
 * 组织 带条件搜索
 * @param data
 * @returns {Promise<void>}
 */
export const queryDepartment = (data = {}) => serverUser.post('/org/query/tree', data);

/**
 * 根据组织id查询用户
 * @param data
 * @returns {Promise<void>}
 */
export const postselectUserByDivisionId = (data = {}) => serverUser.post('/user/selectUserByDivisionId', data);
