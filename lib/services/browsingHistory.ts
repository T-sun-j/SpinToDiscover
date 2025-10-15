/**
 * Browsing History Service
 * 浏览历史服务
 */

import { request } from '../request';
import { 
  GetMyPageListRequest,
  MyPageListResponse,
  ApiResponse 
} from '../api';
import { API_CONSTANTS } from '../constants';


/**
 * 清除浏览历史
 * @param params 请求参数
 * @returns 操作结果
 */
export async function clearBrowsingHistory(
  params: { userId: string; token: string }
): Promise<ApiResponse<{ success: boolean }>> {
  return request<{ success: boolean }>('clearbrowsinghistory', {
    userId: params.userId,
    token: params.token,
  });
}

/**
 * 删除单条浏览历史
 * @param params 请求参数
 * @returns 操作结果
 */
export async function deleteBrowsingHistoryItem(
  params: { 
    userId: string; 
    token: string; 
    historyId: string; 
  }
): Promise<ApiResponse<{ success: boolean }>> {
  return request<{ success: boolean }>('deletebrowsinghistory', {
    userId: params.userId,
    token: params.token,
    historyId: params.historyId,
  });
}

/**
 * 获取用户个人作品列表
 * @param params 请求参数
 * @returns 个人作品列表
 */
export async function getMyPageList(
  params: GetMyPageListRequest
): Promise<ApiResponse<MyPageListResponse>> {
  return request<MyPageListResponse>('getmypagelist', {
    userId: params.userId,
    token: params.token,
    page: params.page || API_CONSTANTS.DEFAULT_PAGE,
    limit: params.limit || API_CONSTANTS.DEFAULT_LIMIT,
  });
}

