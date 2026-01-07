import { serverBase } from '@/axios';

/**
 * 标题分页
 * @param data
 */
export const postTitleList = (data = {}): Promise<any> => serverBase.post('/title/page', data);

/**
 * 添加标题
 * @param data
 */
export const postTitleAdd = (data = {}): Promise<any> => serverBase.post('/title/add', data);

/**
 * 删除标题
 * @param data
 */
export const postTitleDelete = (data = {}): Promise<any> => serverBase.post('/title/delete', data);

/**
 * 标题列表
 * @param data
 */
export const postTitleData = (data = {}): Promise<any> => serverBase.post('/title/list', data);

/**
 * 标题列表
 * @param data
 */
export const postRxTitleStart = (data = {}): Promise<any> => serverBase.post('/title/start', data);

/**
 * 标题列表
 * @param data
 */
export const postRxTitleStartCheck = (data = {}): Promise<any> => serverBase.post('/title/start/check', data);

/**
 * 批量删除标题
 * @param data
 */
export const postBatchDeleteTitle = (data = {}): Promise<any> => serverBase.post('/title/delete/batch', data);

/**
 * 添加文案
 * @param data
 */
export const postAddCopywrite = (data = {}): Promise<any> => serverBase.post('/title/add/copywrite', data);

/**
 * 文案分页
 * @param data
 */
export const postCopywritePage = (data = {}): Promise<any> => serverBase.post('/title/copywrite/page', data);

/**
 * 修改文案
 * @param data
 */
export const postUpdateCopywrite = (data = {}): Promise<any> => serverBase.post('/title/copywrite/update', data);

/**
 * 批量删除文案
 * @param data
 */
export const postBatchDeleteCopywrite = (data = {}): Promise<any> => serverBase.post('/title/copywrite/delete', data);

/**
 * 标题类型
 * @param data
 */
export const postTitleTypeList = (data = {}): Promise<any> => serverBase.post('/title/titleType/list', data);

/**
 * 标题去重
 * @param data
 */
export const postTitleUnique = (data = {}): Promise<any> => serverBase.post('/title/unique', data);

/**
 * 文案去重
 * @param data
 */
export const postCopywriterUnique = (data = {}): Promise<any> => serverBase.post('/title/copywriter/unique', data);