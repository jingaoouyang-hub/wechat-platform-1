import { serverBase } from '@/axios';

/**
 * 列表
 * @param data
 */
export const postFansPicList = (data = {}): Promise<any> => serverBase.post('/fans/list', data);


/**
 * 删除
 * @param data
 */
export const postFansPicDelete = (data = {}): Promise<any> => serverBase.post('/fans/delete', data);

/**
 * 启用状态
 * @param data
 */
export const postFansPicEnable = (data = {}): Promise<any> => serverBase.post('/fans/enable', data);

/**
 * 新增接粉图片
 * @param data
 */
export const postFansPicAdd = (data = {}): Promise<any> => serverBase.post('/fans/add', data);

/**
 * 上传接粉图片
 * @param data
 */
export const postFansPicUpload = (data = {}): Promise<any> => serverBase.post('/fans/upload', data);

/**
 * 接粉背景图片
 * @param data
 */
export const postFansBgSave = (data = {}): Promise<any> => serverBase.post('/fans/background/save', data);

/**
 * 接粉背景图片
 * @param data
 */
export const postFansBgGet = (data = {}): Promise<any> => serverBase.post('/fans/background/get', data);

/**
 * 接粉文案
 * @param data
 */
export const postFansTextSave = (data = {}): Promise<any> => serverBase.post('/fans/text/save', data);

/**
 * 接粉文案
 * @param data
 */
export const postFansTextGet = (data = {}): Promise<any> => serverBase.post('/fans/text/get', data);
