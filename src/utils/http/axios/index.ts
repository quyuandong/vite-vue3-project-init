import { useUserStoreWithOut } from '/@/store/modules/user'
import { deepMerge, setObjToUrlParams } from '/@/utils'
import { HAxios } from './axios'
import { AxiosTransform, CreateAxiosOptions } from './axiosTransform'
import { RequestOptions, Result } from '/#/axios'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ContentTypeEnum, RequestEnum, ResultEnum } from '/@/enums/httpEnum'
import { useMessage } from '/@/hooks/web/useMessage'
import { isString } from '/@/utils/is'
import { formatRequestDate, joinTimestamp } from './helper'
import { getToken } from '/@/utils/auth'
import { useErrorLogStoreWithOut } from '/@/store/modules/errorLog'
import { checkStatus } from './checkStatus'
import { useGlobSetting } from '/@/hooks/setting'

const { createMessage, createErrorModal } = useMessage()

// 获取全局的一些配置
const globSetting = useGlobSetting()
const urlPrefix = globSetting.urlPrefix

/**
 * axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
 */

const transform: AxiosTransform = {
  /**
   * 处理响应数据。如果数据不是预期格式，可直接抛出错误
   * @param res 响应参数
   * @param options 请求配置
   * @returns
   */
  transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isTransformResponse, isReturnNativeResponse } = options
    // 是否需要返回原生响应头
    if (isReturnNativeResponse) return res
    // 是否处理响应数据
    if (!isTransformResponse) return res.data
    // 报错时的返回
    const { data } = res
    if (!data) throw new Error('请求出错，请稍后重试')
    // 后端返回内容格式，前端类型定义在types/axios.d.ts中
    const { code, result, message } = data

    // 是否请求成功 状态码根须需要自行修改
    const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS
    if (hasSuccess) return result

    // 根据自己项目中code 实际情况 执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = ''
    switch (code) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = '登陆超时，请重新登陆'
        const userStore = useUserStoreWithOut()
        userStore.setToken(undefined)
        userStore.logout(true)
        break
      default:
        if (message) {
          timeoutMsg = message
        }
    }

    // model：显示错误弹框，用于比较重要的错误提示；message:消息模式
    if (options.errorMessageMode === 'modal') {
      createErrorModal({ title: '错误提示', content: timeoutMsg })
    } else if (options.errorMessageMode === 'message') {
      createMessage.error(timeoutMsg)
    }
    throw new Error(timeoutMsg || '请求出错，请稍后重试')
  },

  /**
   * 请求之前处理config
   * @param config 请求配置
   * @param options 请求参数值
   * @returns
   */
  beforeRequestHook: (config: AxiosRequestConfig, options: RequestOptions) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options
    // url 是否添加前缀
    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`
    }
    // 是否添加接口地址
    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }
    const params = config.params || {}
    const data = config.data || false
    // 是否格式化请求参数时间
    if (formatDate) {
      data && !isString(data) && formatRequestDate(data)
    }
    // get 请求单独处理
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params)
        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
          config.data = data
          config.params = params
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params
          config.params = undefined
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          )
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },

  /**
   *  请求拦截处理
   * @param config 请求配置
   * @param options 请求参数值
   * @returns
   */
  requestInterceptors: (
    config: AxiosRequestConfig,
    options: CreateAxiosOptions,
  ): AxiosRequestConfig => {
    // 处理请求之前的config---此处处理token
    const token = getToken()
    if (token && (config as Recordable).requestOptions.withToken !== false) {
      // jwt token
      ;(config as Recordable).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token
    }
    return config
  },

  /**
   * 响应拦截处理
   * @param res 返回参数
   * @returns
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res
  },

  /**
   * 响应错误拦截
   * @param error 错误信息
   * @returns
   */
  responseInterceptorsCatch: (error: any) => {
    // 添加错误信息
    const errorLogStore = useErrorLogStoreWithOut()
    errorLogStore.addAjaxErrorInfo(error)
    const { response, code, message, config } = error || {}
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none'
    const msg: string = response?.data?.error?.message ?? ''
    const err: string = error?.toString?.() ?? ''
    let errMessage = ''

    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = '接口请求超时，请刷新页面重试！'
      }
      if (err?.includes('Network Error')) {
        errMessage = '网络异常，请检查您的网络连接是否正常！'
      }
      if (errMessage) {
        if (errorMessageMode === 'modal') {
          createErrorModal({ title: '错误提示', content: errMessage })
        } else if (errorMessageMode === 'message') {
          createMessage.error(errMessage)
        }
        return Promise.reject(error)
      }
    } catch (error) {
      throw new Error(error as unknown as string)
    }
    checkStatus(error?.response?.status, msg, errorMessageMode)
    return Promise.reject(error)
  },
}

/**
 * 创建axios实例
 * @param opt 参数
 * @returns
 */
function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new HAxios(
    deepMerge(
      {
        // 认证方案 eg: Bearer
        authenticationScheme: '',
        // 接口延迟
        timeout: 10 * 1000,
        // 基础接口
        // baseURL: globSetting.apiUrl,
        // 请求头 json格式
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 请求头 form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，以下选项均可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          // 接口拼接地址
          urlPrefix: urlPrefix,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
        },
      },
      opt || {},
    ),
  )
}

export const defHttp = createAxios()
