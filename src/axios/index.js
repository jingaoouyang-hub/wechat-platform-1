import { BaseRequest } from './request';
export const serverUser = new BaseRequest('user-center'); // 用户鉴权中心
export const serverPortal = new BaseRequest('portal'); // 公共服务
export const serverFile = new BaseRequest('server-file'); // 文件服务中心
export const serverOrganization = new BaseRequest('server-organization'); // 组织架构中心
export const messageCenter = new BaseRequest('message-center'); // 消息中心
export const logCenter = new BaseRequest('log-center'); // 日志中心
export const serverBase = new BaseRequest(''); // 通用URL
export const serverAccount = new BaseRequest('account'); // 公众号
