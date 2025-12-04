import { serverBase } from '@/axios';
/**
 * 获取用户列表
 * @param data
 * @returns {Promise<void>}
 */
export const postAccountList = (data = {}): Promise<any> => serverBase.post('/user/query/page', data);

/**
 * 添加用户
 * @param data
 * @returns {Promise<void>}
 */
export const postAccountAdd = (data = {}) => serverBase.post('/user/add', data);

/**
 * 修改用户
 * @param data
 * @returns {Promise<void>}
 */
export const postAccountUpdate = (data = {}) => serverBase.post('/user/update', data);

/**
 * 删除用户
 * @param data
 * @returns {Promise<void>}
 */
export const postAccountDelete = (data = {}) => serverBase.post('/user/delete', data);

/**
 * 登录解锁
 * @param data
 * @returns {Promise<void>}
 */
export const loginUnlock = (data = {}) => serverBase.post('/user/loginUnlock/id', data);

/**
 * 重置密码
 * @param data
 * @returns {Promise<void>}
 */
export const postAccountResetPsw = (data = {}) => serverBase.post('/user/reset/pwd', data);

/**
 * 获取用户单条信息
 * @param data
 * @returns {Promise<void>}
 */
export const postAccountSingle = (data = {}) => serverBase.post('/user/query/id', data);

/**
 * 账号启用/禁用
 * @param data
 * @returns {Promise<void>}
 */
export const postAccountUpdatestatus = (data = {}) => serverBase.post('/user/update/status', data);
