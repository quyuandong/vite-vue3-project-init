/**
 * axios 请求相关的类型定义
 */

// 错误消息提示类型
export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined

// 请求参数类型
export interface RequestOptions {
  // 是否将请求参数拼接到url上
  joinParamsToUrl?: boolean
  // 是否格式化请求参数时间
  formatDate?: boolean
  // 是否处理请求结果
  isTransformResponse?: boolean
  // 是否返回本机响应头，当要获取响应头时使用
  isReturnNativeResponse?: boolean
  // url 是否添加前缀
  joinPrefix?: boolean
  // 接口地址，若为空则使用默认的apiUrl
  apiUrl?: string
  // 请求拼接路径
  urlPrefix?: string
  // 错误消息提示类型
  errorMessageMode?: ErrorMessageMode
  // 是否添加时间错
  joinTime?: boolean
  // 是否忽略取消token
  ignoreCancelToken?: boolean
  // 在请求头中是否添加token
  withToken?: boolean
}

// 响应结果类型
export interface Result<T = any> {
  code: number // 状态码
  type: 'success' | 'error' | 'warning' //类型
  message: string //消息
  result: T //返回结果
}

// 文件上传请求参数
export interface UploadFileParams<T = any> {
  data?: Recordable // 数据
  name?: string // 文件参数 接口字段名
  file: File | Blob // 文件
  filename?: string // 文件名
  [key: string]: any
}
