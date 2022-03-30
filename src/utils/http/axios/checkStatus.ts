import { SessionTimeoutProcessingEnum } from '/@/enums/appEnum'
import projectSetting from '/@/settings/projectSetting'
import { ErrorMessageMode } from '/#/axios'
import { useUserStoreWithOut } from '/@/store/modules/user'
import { useMessage } from '/@/hooks/web/useMessage'
/**
 *
 * 根据响应的状态码
 *
 */

const { createErrorModal, createMessage } = useMessage()

// 会话超时解决方案
const stp = projectSetting.sessionTimeoutProcessing

export function checkStatus(
  status: number,
  msg: string,
  errorMessageMode: ErrorMessageMode = 'message',
): void {
  const userStore = useUserStoreWithOut()
  let errMessage = ''

  switch (status) {
    case 400:
      errMessage = `${msg}`
      break
    case 401:
      userStore.setToken(undefined)
      errMessage = msg || '用户没有权限(令牌、用户名、密码错误)'
      if (stp === SessionTimeoutProcessingEnum.PAGE_COVERAGE) {
        userStore.setSessionTimeout(true)
      } else {
        userStore.logout(true)
      }
      break
    case 403:
      errMessage = '用户得到授权，但是访问是被禁止的。!'
      break
    case 404:
      errMessage = '网络请求错误,未找到该资源!'
      break
    case 405:
      errMessage = '网络请求错误,请求方法未允许!'
      break
    case 408:
      errMessage = '网络请求超时!'
      break
    case 500:
      errMessage = '服务器错误,请联系管理员!'
      break
    case 501:
      errMessage = '网络未实现!'
      break
    case 502:
      errMessage = '网络错误!'
      break
    case 503:
      errMessage = '服务不可用，服务器暂时过载或维护!'
      break
    case 504:
      errMessage = '网络超时!'
      break
    case 505:
      errMessage = 'http版本不支持该请求!'
      break

    default:
      break
  }
  if (errMessage) {
    if (errorMessageMode === 'modal') {
      createErrorModal({ title: '错误提示', content: errMessage })
    } else if (errorMessageMode === 'message') {
      createMessage.error(errMessage)
    }
  }
}
