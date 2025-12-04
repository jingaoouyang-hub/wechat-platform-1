import { serverBase } from '@/axios';

/**
 * 素材分页
 * @param data
 */
export const postMaterialList = (data = {}): Promise<any> => serverBase.post('/material/page', data);

/**
 * 素材添加
 * @param data
 */
export const postMaterialAdd = (data = {}): Promise<any> => serverBase.post('/material/add', data);

/**
 * 素材删除
 * @param data
 */
export const postMaterialDelete = (data = {}): Promise<any> => serverBase.post('/material/delete', data);

/**
 * 素材上传
 * @param data
 */
export const postMaterialAddByUpload = (data = {}): Promise<any> => serverBase.post('/material/img/upload', data);

/**
 * 素材批量删除
 * @param data
 */
export const postMaterialBatchDelete = (data = {}): Promise<any> => serverBase.post('/material/delete/batch', data);

/**
 * 合成图片类型
 * @param data
 */
export const postMaterialGenerateType = (data = {}): Promise<any> => serverBase.post('/material/generate/type', data);

/**
 * 合成随机图片
 * @param data
 */
export const postMaterialGenerateRandom = (data = {}): Promise<any> =>
  serverBase.postFile('/material/generate/random', data);

/**
 * 合成选择图片
 * @param data
 */
export const postMaterialGenerateSelected = (data = {}): Promise<any> =>
  serverBase.postFile('/material/generate/selected', data);

export const postMaterialMove = (data = {}): Promise<any> => serverBase.post('/material/batch/move', data);

// 删除分组
export const postDeleteGroup = (data = {}): Promise<any> => serverBase.post('/material/batch/delete', data);


// 移动分组
export const postMoveGroup = (data = {}): Promise<any> => serverBase.post('/material/batch/update', data);