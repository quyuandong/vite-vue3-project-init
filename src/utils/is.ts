/**
 * 类型判断两个的工具方法
 */

// 判断值不是undefined
export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined'
}

// 判断值是undefined
export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val)
}

// 判断值是否是null
export function isNull(val: unknown): val is null {
  return val === null
}

// 判断是是否是 null 或者是undefined
export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val)
}

// 是否是那种类型
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

// 是否是对象类型
export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

// 是否是方法类型
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

// 是否是string类型
export function isString(val: unknown): val is string {
  return is(val, 'String')
}

// 是否是url地址
export function isUrl(path: string): boolean {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}

// 是否是数组
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

// 是否是数字
export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

// 是否是boolean类型
export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

// 是否是服务端
export const isServer = typeof window === 'undefined'

// 是否是客户端
export const isClient = !isServer

// 是否是undefine 或者 null
export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

// 是否是map类型
export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map')
}
