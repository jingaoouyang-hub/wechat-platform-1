import { serverPortal } from '@/axios';

/**
 * 项目配置查询
 * @param data
 * @returns {Promise<void>}
 */
export const configQuery = (data = {}) => serverPortal.post('/sys/project/config/query', data);

/**
 * 更新背景图
 * @param data
 * @returns {Promise<void>}
 */
export const updateConfigBackground = (data = {}) => serverPortal.post('/sys/project/config/update/background', data);

/**
 * 更新logo
 * @param data
 * @returns {Promise<void>}
 */
export const updateConfigLogo = (data = {}) => serverPortal.post('/sys/project/config/update/logo', data);

/**
 * 更新信息
 * @param data
 * @returns {Promise<void>}
 */
export const updateConfigInfo = (data = {}) => serverPortal.post('/sys/project/config/update/info', data);
