import { serverBase } from '@/axios';

/**
 * 小程序图片添加
 * @param data
 */
export const postAppletImageAdd = (data = {}): Promise<any> => serverBase.post('/applet/image/add', data);


/**
 * 小程序图片删除
 * @param data
 */
export const postAppletImageDelete = (data = {}): Promise<any> => serverBase.post('/applet/image/delete', data);

/**
 * 小程序图片信息
 * @param data
 */
export const postAppletImageInfo = (data = {}): Promise<any> => serverBase.post('/applet/image/get', data);

/**
 * 小程序图片列表
 * @param data
 */
export const postAppletImageList = (data = {}): Promise<any> => serverBase.post('/applet/image/list', data);

/**
 * 小程序图片启用列表
 * @param data
 */
export const postAppletImageListEnabled = (data = {}): Promise<any> => serverBase.post('/applet/image/listEnabled', data);

/**
 * 小程序图片分页列表
 * @param data
 */
export const postAppletImagePage = (data = {}): Promise<any> => serverBase.post('/applet/image/page', data);

/**
 * 小程序图片更新
 * @param data
 */
export const postAppletImageUpdate = (data = {}): Promise<any> => serverBase.post('/applet/image/update', data);


/**
 * 小程序按钮配置添加
 * @param data
 */
export const postAppletButtonAdd = (data = {}): Promise<any> => serverBase.post('/applet/button/add', data);


/**
 * 小程序按钮配置删除
 * @param data
 */
export const postAppletButtonDelete = (data = {}): Promise<any> => serverBase.post('/applet/button/delete', data);

/**
 * 小程序按钮配置信息
 * @param data
 */
export const postAppletButtonInfo = (data = {}): Promise<any> => serverBase.post('/applet/button/get', data);

/**
 * 小程序按钮配置列表
 * @param data
 */
export const postAppletButtonList = (data = {}): Promise<any> => serverBase.post('/applet/button/list', data);

/**
 * 小程序按钮配置启用列表
 * @param data
 */
export const postAppletButtonListEnabled = (data = {}): Promise<any> => serverBase.post('/applet/button/listEnabled', data);

/**
 * 小程序按钮配置分页列表
 * @param data
 */
export const postAppletButtonPage = (data = {}): Promise<any> => serverBase.post('/applet/button/page', data);

/**
 * 小程序按钮配置更新
 * @param data
 */
export const postAppletButtonUpdate = (data = {}): Promise<any> => serverBase.post('/applet/button/update', data);