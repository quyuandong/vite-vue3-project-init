/**
 * 添加一些axios 中的辅助方法
 */

import { isObject, isString } from '../../is'
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

/**
 * 格式请求参数时间格式请求参数时间
 * @param params 参数
 * @returns
 */
export function formatRequestDate(params: Recordable) {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    return
  }
  for (const key in params) {
    if (params[key] && params[key]._isAMomentObject) {
      params[key] = params[key].format(DATE_TIME_FORMAT)
    }
    if (isString(key)) {
      const value = params[key]
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value
        } catch (error: any) {
          throw new Error(error)
        }
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key])
    }
  }
}
// 时间戳函数 类型限定
export function joinTimestamp<T extends boolean>(
  join: boolean,
  result: T,
): T extends true ? string : object

// 加入时间戳
export function joinTimestamp(join: boolean, result = false): string | Object {
  if (!join) return result ? '' : {}
  const now = new Date().getTime()
  if (result) return `?_t=${now}`
  return { _t: now }
}
