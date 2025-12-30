import { serverBase } from '@/axios';

/**
 * 列表
 * @param data
 */
export const postWindowFansList = (data = {}): Promise<any> => serverBase.post('/window/fans/list', data);

/**
 * 添加
 * @param data
 */
export const postWindowFansAdd= (data = {}): Promise<any> => serverBase.post('/window/fans/add', data);

/**
 * 删除
 * @param data
 */
export const postWindowFansDelete= (data = {}): Promise<any> => serverBase.post('/window/fans/delete', data);


/**
 * 启用禁用
 * @param data
 */
export const postWindowFansEnable= (data = {}): Promise<any> => serverBase.post('/window/fans/enable', data);

/**
 * 启用禁用
 * @param data
 */
export const postWindowFansUpdate= (data = {}): Promise<any> => serverBase.post('/window/fans/update', data);