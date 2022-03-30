import { GetUserInfoModel, LoginParams, LoginResultModel } from './model/userModel'
import { ErrorMessageMode } from '/#/axios'
import { defHttp as http } from '/@/utils/http/axios'
enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
}

// 登陆接口
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return http.post<LoginResultModel>({ url: Api.Login, params }, { errorMessageMode: mode })
}

// 获取用户信息
export function getUserInfo() {
  return http.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' })
}

// 获取权限码
export function getPermCode() {
  return http.get<string[]>({ url: Api.GetPermCode })
}

// 退出登陆
export function doLogout() {
  return http.get({ url: Api.Logout })
}
