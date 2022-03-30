import axios, { AxiosRequestConfig, Canceler } from 'axios'
import { isFunction } from '/@/utils/is'

/**
 * 取消axios请求  可以用于避免多次请求
 */

// 用于存储每个请求的标识和取消功能
let pendingMap = new Map<string, Canceler>()

// 获取等待的请求（请求方式 + url）
export const getPending = (config: AxiosRequestConfig) => [config.method, config.url].join('&')

export class AxiosCanceler {
  /**
   * 添加等待中的请求
   * @param config 请求参数
   */
  addPending(config: AxiosRequestConfig) {
    this.removePending(config)
    const url = getPending(config)
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken(cancel => {
        if (!pendingMap.has(url)) {
          // 如果在pending中没有当前请求，则添加它
          pendingMap.set(url, cancel)
        }
      })
  }

  /**
   * 清空所有等待的请求
   */
  removeAllPending() {
    pendingMap.forEach(cancel => {
      cancel && isFunction(cancel) && cancel()
    })
    pendingMap.clear()
  }

  /**
   * 移除等待中的请求
   * @param config 请求参数
   */
  removePending(config: AxiosRequestConfig) {
    const url = getPending(config)

    if (pendingMap.has(url)) {
      const cancel = pendingMap.get(url)
      cancel && cancel()
      pendingMap.delete(url)
    }
  }

  /**
   * 重置等待的map集合
   */
  reset(): void {
    pendingMap = new Map<string, Canceler>()
  }
}
