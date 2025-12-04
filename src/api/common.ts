import { serverBase, serverPortal } from '@/axios/index';

export const regionChildren = data => serverBase.post('/common/region/query/children', data);

/**
 * 请求省份
 * @param data
 * @returns {Promise<void>}
 */
export const postRegionList = (data = {}) =>
  serverBase.post('/v1/common/region/query/children', data, { loading: true });

/**
 * 文件上传
 * @param data
 * @returns {Promise<void>}
 */
export const postFileUpload = (data: any) => serverBase.post('/business-center/upload', data);

/**
 * 获取指定字典类型下的所有字典数据
 * @param data
 * @returns {Promise<void>}
 */
export const dictTypeQuery = (data: any) => serverBase.post('/portal/sys/dict_item/query/items', data);

/**
 * 获取指定字典类型下的所有字典数据
 * @param data
 * @returns {Promise<void>}
 */
export const postDictListQuery = (data: any) => serverBase.post('/portal/sys/dict_item/query/list/items', data);

/**
 * 上传文件
 * @param data
 * @returns {Promise<void>}
 */
export const uploadFile = (data = {}, config = {}): Promise<any> =>
  serverPortal.post('/file/storage/upload', data, config);

/**
 * 上传图片
 * @param data
 * @returns {Promise<void>}
 */
export const uploadImage = (data = {}, config = {}): Promise<any> =>
  serverPortal.post('/file/storage/upload-image', data, config);

/**
 * 【文件管理-上传记录】获取文件分片信息
 * @param data
 * @returns {Promise<void>}
 */
export const createMultipartUpload = (data = {}, config = {}): Promise<any> =>
  serverPortal.post('/file/storage/upload/createMultipartUpload', data, config);

/**
 * 【文件管理-上传记录】合并文件分片
 * @param data
 * @returns {Promise<void>}
 */
export const completeMultipartUpload = (data = {}, config = {}): Promise<any> =>
  serverPortal.post('/file/storage/upload/completeMultipartUpload', data, config);
