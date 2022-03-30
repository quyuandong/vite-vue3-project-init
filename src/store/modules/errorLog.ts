import projectSetting from '/@/settings/projectSetting'
import { defineStore } from 'pinia'
import { ErrorLogInfo } from '/#/store'
import { formatToDateTime } from '/@/utils/dateUtil'
import { ErrorTypeEnum } from '/@/enums/exceptionEnum'
import { store } from '/@/store'

/**
 * 错误日志相关的store
 */
// 定义store中的参数
export interface ErrorLogState {
  errorLogInfoList: Nullable<ErrorLogInfo[]> // 错误信息列表
  errorLogListCount: number // 错误信息个数
}
export const useErrorLogStore = defineStore({
  id: 'app-error-log',
  state: (): ErrorLogState => ({
    errorLogInfoList: null,
    errorLogListCount: 0,
  }),
  getters: {
    getErrorLogInfoList(): ErrorLogInfo[] {
      return this.errorLogInfoList || []
    },
    getErrorLogListCount(): number {
      return this.errorLogListCount
    },
  },
  actions: {
    // 添加错误信息
    addErrorLogInfo(info: ErrorLogInfo) {
      const item = {
        ...info,
        time: formatToDateTime(new Date()),
      }
      this.errorLogInfoList = [item, ...(this.errorLogInfoList || [])]
      this.errorLogListCount += 1
    },

    // 设置错误信息个数
    setErrorLogListCount(count: number): void {
      this.errorLogListCount = count
    },

    // 添加请求相关的的错误信息
    addAjaxErrorInfo(error) {
      const { useErrorHandle } = projectSetting
      // 是否使用全局错误捕获
      if (!useErrorHandle) return
      const errorInfo: Partial<ErrorLogInfo> = {
        message: error.message,
        type: ErrorTypeEnum.AJAX,
      }
      if (error.response) {
        const {
          config: { url = '', data: params = '', method = 'get', header = {} } = {},
          data = {},
        } = error.response
        errorInfo.url = url
        errorInfo.name = 'Ajax Error！'
        errorInfo.file = '-'
        errorInfo.stack = JSON.stringify(data)
        errorInfo.detail = JSON.stringify({ params, method, header })
      }
      this.addErrorLogInfo(errorInfo as ErrorLogInfo)
    },
  },
})

// 需要在设置之之外使用
export function useErrorLogStoreWithOut() {
  return useErrorLogStore(store)
}
