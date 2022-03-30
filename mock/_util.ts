/**
 * 接口用于返回数据格式的统一格式  接口用于返回数据格式的统一格式
 */

// 非分页请求成功
export function resultSuccess<T = Recordable>(result: T, { message = 'ok' } = {}) {
  return {
    code: 0,
    result,
    message,
    type: 'success',
  }
}

// 分页请求成功
export function resultPageSuccess<T = any>(
  page: number,
  pageSize: number,
  list: T[],
  { message = 'ok' } = {},
) {
  const pageData = pagination(page, pageSize, list)
  return {
    ...resultSuccess({
      items: pageData,
      total: list.length,
    }),
    message,
  }
}

// 请求错误
export function resultError(message = 'Request failed', { code = -1, result = null } = {}) {
  return {
    code,
    result,
    message,
    type: 'error',
  }
}

/**
 * 将数据进行分页
 * @param pageNo
 * @param pageSize
 * @param array
 * @returns
 */
export function pagination<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
  const offset = (pageNo - 1) * Number(pageSize)
  const ret =
    offset + Number(pageSize) >= array.length
      ? array.splice(offset, array.length)
      : array.splice(offset, offset + Number(pageSize))
  return ret
}

export interface requestParams {
  method: string
  body: any
  headers?: { authorization?: string }
  query: any
}

// 获取请求token，从请求头中获取token
export function getRequestToken({ headers }: requestParams): string | undefined {
  return headers?.authorization
}
