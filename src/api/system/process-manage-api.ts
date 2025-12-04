import { serverPortal } from '@/axios';

/**
 * 新增或编辑流程信息，然后直接发布
 * @param data
 * @returns {Promise<void>}
 */
export const postBpmnEdit = (data = {}) => serverPortal.post('/bpmn/v1/edit/and/publish', data);

/**
 * 查询流程详情
 * @param data
 * @returns {Promise<void>}
 */
export const postBpmnDetail = (data = {}) => serverPortal.post('/bpmn/v1/detail', data);

/**
 * 查询流程管理列表-分页
 * @param data
 * @returns {Promise<void>}
 */
export const postBpmnPage = (data = {}) => serverPortal.post('/bpmn/v1/page', data);

/**
 * 根据流程定义id和实例id获取审批详情数据
 * @param data
 * @returns {Promise<void>}
 */
export const postBpmnAuditData = (data = {}) => serverPortal.post('/bpmn/biz/v1/get/audit/history', data);
