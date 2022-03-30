/**
 * 数据处理类，可根据工程进行配置
 */

import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { RequestOptions, Result } from '/#/axios'

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string //认证方案
  transform?: AxiosTransform // 处理
  requestOptions?: RequestOptions
}

export abstract class AxiosTransform {
  // 请求之前的流程配置
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig

  // 请求成功的配置
  transformRequestHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any

  // 请求失败处理
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>

  // 请求拦截
  requestInterceptors?: (
    config: AxiosRequestConfig,
    options: CreateAxiosOptions,
  ) => AxiosRequestConfig

  // 响应拦截
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>

  // 请求拦截错误处理
  requestInterceptorsCatch?: (error: Error) => void

  // 响应错误拦截
  responseInterceptorsCatch?: (error: Error) => void
}
