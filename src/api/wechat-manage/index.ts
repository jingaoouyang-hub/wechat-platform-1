import { serverAccount, serverBase } from '@/axios';

/**
 * 公众号列表 列表
 * @param data
 */
export const postAccountList = (data = {}): Promise<any> => serverAccount.post('/page', data);

export const postAccountDelete = (data = {}): Promise<any> => serverAccount.post('/delete', data);

export const postAccountAdd = (data = {}): Promise<any> => serverAccount.post('/add', data);

export const postAccountUpdate = (data = {}): Promise<any> => serverAccount.post('/update', data);

// 素材类型列表
export const postMaterialTypeList = (data = {}): Promise<any> => serverAccount.post('/material/type/list', data);

// 删除模版信息
export const postTemplateDelete = (data = {}): Promise<any> => serverAccount.post('/template/delete', data);

// 查询公众号id查询模版列表
export const postTemplateQuery = (data = {}): Promise<any> => serverAccount.post('/template/query', data);

// 保存模版信息
export const postTemplateSave = (data = {}): Promise<any> => serverAccount.post('/template/save', data);

// 根据账号发布素材到草稿箱
export const postAccountPublish = (data = {}): Promise<any> => serverAccount.post('/accountId/publish', data);

/**
 * 公众号列表
 * @param data
 */
export const postAcountList = (data = {}): Promise<any> => serverAccount.post('/list ', data);

/**
 * 查询公众号登录状态
 * @param data
 */
export const postWechatLoginStatus = (data = {}): Promise<any> =>
  serverBase.get('/reptile/wxArticle/askQRCode ', data, { notNeedMessage: true });

/**
 * 生成登录二维码
 * @param data
 */
export const postWechatLoginQrcode = (data = {}): Promise<any> =>
  serverBase.getFile('/reptile/wxArticle/getImage ', data);

/**
 * 发布记录分页查询
 * @param data
 */
export const postAcountPublishRecordList = (data = {}): Promise<any> => serverAccount.post('/publish/record', data);

/**
 * 素材下载
 * @param data
 */
export const postMaterialDownload = (data = {}): Promise<any> => serverAccount.getFile('/getDownLoadZip', data);

/**
 * 爬取数据
 * @param data
 */
export const postReptileStart = (data = {}): Promise<any> => serverBase.post('/reptile/wxArticle/start', data);

/**
 * 爬取数据
 * @param data
 */
export const postWechatLoginCheck = (data = {}): Promise<any> =>
  serverBase.get('/reptile/wxArticle/check', data, { notNeedMessage: true });

/**
 * 获取公众号发布记录
 * @param data
 */
export const postAccountPublishRecord = (data = {}): Promise<any> =>
  serverBase.post('/account/publish/record', data, { notNeedMessage: true });

/**
 * 自定义爬取
 * @param data
 */
export const postRepTitleCumstomStartCheck = (data = {}): Promise<any> =>
  serverBase.post('/reptile/wxArticle/start/check', data, { notNeedMessage: true });

/**
 * 模板分页
 * @param data
 */
export const postTemplatePage = (data = {}): Promise<any> => serverBase.post('/account/template/page', data);

/**
 * 获取公众号发布记录
 * @param data
 */
export const postWechatAccount = (data = {}): Promise<any> => serverBase.post('/account/list', data);

/**
 * 批量发布草稿
 * @param data
 */
export const postPublishBatch = (data = {}): Promise<any> => serverBase.post('/account/accountId/publish/batch', data);



