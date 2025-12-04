import { serverUser } from '@/axios';

/**
 * 分页查询角色
 * @param data
 * @returns {Promise<void>}
 */
export const postRoleList = (data = {}) => serverUser.post('/role/query/page', data);

/**
 * 查询所有启用的角色
 * @param data
 * @returns {Promise<void>}
 */
export const postAllRole = (data = {}): Promise<any> => serverUser.post('/role/query/list', data, { loading: false });

/**
 * 添加角色
 * @param data
 * @returns {Promise<void>}
 */
export const postAddRole = (data = {}) => serverUser.post('/role/add', data);

/**
 * 修改角色
 * @param data
 * @returns {Promise<void>}
 */
export const postUpdateRole = (data = {}) => serverUser.post('/role/update', data);

/**
 * 根据id查询
 * @param data
 * @returns {Promise<void>}
 */
export const postRoleDetail = (data = {}) => serverUser.post('/role/query/id', data);

/**
 * 删除角色
 * @param data
 * @returns {Promise<void>}
 */
export const postDeleteRole = (data = {}) => serverUser.post('/role/delete', data);

/**
 * 获取角色权限
 * @param data
 * @returns {Promise<void>}
 */
export const rolePermissionTree = (data = {}) =>
  serverUser.post('/res/module/query/role/res/tree', data, { loading: true });

/**
 * 保存角色权限
 * @param data
 * @returns {Promise<void>}
 */
export const postRoleAuthorize = (data = {}) => serverUser.post('/role/authorize', data, { loading: true });
/**
 * 角色-数据授权
 * @param data
 * @returns {Promise<void>}
 */
export const postRoleAuthDatascope = (data = {}) =>
  serverUser.post('/role/authorize/datascope', data, { loading: true });

// 查询树(全部)
export const postOrgTreeAll = (data = {}): Promise<any> =>
  serverUser.post('/org/query/tree/all', data, { loading: false });

// 查询树(全部)
export const postOrgTreeAllTerm = (data = {}): Promise<any> =>
  serverUser.post('/org/query/tree', data, { loading: false });

// 查询用户列表
export const postUserList = (data = {}): Promise<any> => serverUser.post('/user/query/list', data, { loading: true });

// 根据状态查询所有用户
export const postUserStatusList = (data = {}): Promise<any> =>
  serverUser.post('/user/query/status/list', data, { loading: false });

// 更改角色配置
export const postStatusUpdate = (data = {}) => serverUser.post('/role/update/status', data, { loading: true });

// 查询资源权限树(全部，部分不可操作状态)
export const rolePermissionTreeByUser = (data = {}) =>
  serverUser.post('/res/module/query/role/res/tree/by/user', data, { loading: true });
