import { serverBase, serverBase } from '@/axios/index';
import qs from 'qs';

/**
 * 登陆
 * @param data
 * @returns {Promise<void>}
 */
export const login = (data = {}) => serverBase.post('/auth/login', data, { loading: true });

/**
 * 获取验证图片  以及token
 * @param data
 * @returns {Promise<void>}
 */
export const reqGet = (data = {}) => serverBase.post('/captcha/get', data, { loading: true });

/**
 * 滑动或者点选验证
 * @param data
 * @returns {Promise<void>}
 */
export const reqCheck = (data = {}) => serverBase.post('/captcha/check', data, { loading: false });

/**
 * 注销登陆
 * @param data
 * @returns {Promise<void>}
 */
export const postLogout = (data = {}) => serverBase.post('/auth/logout', data, { loading: true });

/**
 * 获取ras加密的key
 * @param data
 * @returns {Promise<void>}
 */
export const postRsaKey = (data = {}) => serverBase.post('/auth/public/key', data);

/**
 * 用户信息
 * @param data
 * @returns {Promise<void>}
 */
export const userInfo = (data = {}) => serverBase.post('/auth/login/info', data, { loading: true });

/**
 * 更新密码 /auth/update/password
 * @param data
 * @returns {Promise<void>}
 */
export const updatePwd = (data = {}) => serverBase.post('/user/update/owner/pwd', data, { loading: true });

/**
 * 用户信息
 * @param data
 * @returns {Promise<void>}
 */
export const updateUserInfo = (data = {}) => serverBase.post('/user/update/info', data, { loading: true });

/**
 * 修改真实名称
 * @param data
 * @returns {Promise<void>}
 */
export const updateRealName = (data = {}) => serverBase.post('/user/update/real/name', data, { loading: true });

/**
 * 个人修改密码
 * @param data
 * @returns {Promise<void>}
 */
export const updateOwnerPwd = (data = {}) => serverBase.post('/user/update/owner/pwd', data, { loading: true });

/**
 * 个人修改头像
 * @param data
 * @returns {Promise<void>}
 */
export const uploadAvatar = (data = {}) => serverBase.post('/user/update/avatar/url', data, { loading: true });

/**
 * 查询当前用户菜单及权限
 * @param data
 * @returns {Promise<void>}
 */
export const menuTree = (data = {}) => serverBase.post('/auth/query/menu/tree', data, { loading: true });
