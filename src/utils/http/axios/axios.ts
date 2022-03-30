import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { isFunction } from '/@/utils/is'
import { AxiosCanceler } from './axiosCancel'
import { CreateAxiosOptions } from './axiosTransform'
import { RequestOptions, Result, UploadFileParams } from '/#/axios'
import { cloneDeep } from 'lodash-es'
import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum'
import qs from 'qs'
export * from './axiosTransform'

/**
 * axios 的具体实现
 */
export class HAxios {
  private axiosInstance: AxiosInstance
  private readonly options: CreateAxiosOptions

  constructor(options: CreateAxiosOptions) {
    this.options = options
    this.axiosInstance = axios.create(options)
    // 拦截器配置
    this.setupInterceptors()
  }

  // 创建axios 实例
  private createAxios(config: CreateAxiosOptions) {
    this.axiosInstance = axios.create(config)
  }

  // 获取axios 请求过程配置 请求拦截及响应拦截的
  private getTransform() {
    const { transform } = this.options
    return transform
  }

  // 获取axios实例
  getAxios(): AxiosInstance {
    return this.axiosInstance
  }

  // 重新配置axios
  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) return
    this.createAxios(config)
  }

  // 设置通用头
  setHeader(headers: any) {
    if (!this.axiosInstance) return
    Object.assign(this.axiosInstance.defaults.headers, headers)
  }

  // 拦截器配置
  private setupInterceptors() {
    const transform = this.getTransform()
    if (!transform) return
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform

    // 创建一个等待请求的实例
    const axiosCanceler = new AxiosCanceler()

    // 请求拦截相关的处理操作
    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      const {
        // @ts-ignore
        headers: { ignoreCancelToken },
      } = config
      // 没有token 是否取消请求
      const ignoreCancel =
        ignoreCancelToken !== undefined
          ? ignoreCancelToken
          : this.options.requestOptions?.ignoreCancelToken

      // 不取消请求 添加等待
      !ignoreCancel && axiosCanceler.addPending(config)

      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options)
      }
      return config
    }, undefined)

    // 请求拦截错误捕捉
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch)

    // 响应拦截
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res)
      }
      return res
    }, undefined)

    // 响应拦截错误捕捉
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch)
  }

  // 支持 form-data 类型数据
  supportFormData(config: AxiosRequestConfig) {
    const header = config.headers || this.options.headers
    const contentType = header?.['Content-Type'] || header?.['content-type']
    if (
      contentType !== ContentTypeEnum.FORM_DATA ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === RequestEnum.GET
    ) {
      return config
    }
    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
    }
  }

  // 文件上传
  uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
    const formData = new window.FormData()
    const customFilename = params.name || 'file'
    if (params.filename) {
      formData.append(customFilename, params.file, params.filename)
    } else {
      formData.append(customFilename, params.file)
    }

    if (params.data) {
      Object.keys(params.data).forEach(key => {
        const value = params.data![key]
        if (Array.isArray(value)) {
          value.forEach(item => {
            formData.append(`${key}[]`, item)
          })
          return
        }
        formData.append(key, params.data![key])
      })
    }
  }

  // 常用的几种请求方法
  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options)
  }

  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options)
  }

  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options)
  }

  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options)
  }

  /**
   *  请求主体
   * @param config 配置
   * @param options 参数
   * @returns
   */
  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    // 配置参数
    let conf: CreateAxiosOptions = cloneDeep(config)
    // 请求过程中间件 类型定义
    const transform = this.getTransform()
    // 请求参数
    const { requestOptions } = this.options
    // 对请求参数进行赋值并生成一个新的对象
    const opt: RequestOptions = Object.assign({}, requestOptions, options)
    // 请求之前，请求成功，请求错误 的类型定义
    const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {}
    // 是否请求之前预处理
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }

    conf.requestOptions = opt
    // 是否是form-data格式 进行支持
    conf = this.supportFormData(conf)

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt)
              resolve(ret)
            } catch (error) {
              reject(error || new Error('request error!'))
            }
          }
        })
        .catch((e: Error | AxiosError) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt))
            return
          }
          if (axios.isAxiosError(e)) {
            // TODO: 在这里写axios的错误信息
          }
          reject(e)
        })
    })
  }
}
