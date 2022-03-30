/**
 * 注入上下文--全局
 */

import { InjectionKey, reactive, UnwrapRef, readonly as defineReadonly, provide, inject } from 'vue'
import { warn } from '/@/utils/log'

export interface CreateContextOptions {
  readonly?: boolean
  createProvider?: boolean
  native?: boolean
}
// unWrapRef 反解析 ref.value 的类型
type ShallowUnwrap<T> = {
  [P in keyof T]: UnwrapRef<T[P]>
}

/**
 * 注入值 provide
 * @param context
 * @param key
 * @param options
 * @returns
 */
export function createContext<T>(
  context: any,
  key: InjectionKey<T> = Symbol(),
  options: CreateContextOptions = {},
) {
  const { readonly = true, createProvider = false, native = false } = options
  const state = reactive(context)
  // 是否值只读
  const provideData = readonly ? defineReadonly(state) : state
  !createProvider && provide(key, native ? context : provideData)

  return {
    state,
  }
}

/**
 * 获取值inject
 * @param key
 * @param native
 */
export function useContext<T>(key: InjectionKey<T>, native?: boolean): T
export function useContext<T>(key: InjectionKey<T>, defaultValue?: any, native?: boolean): T
export function useContext<T>(
  key: InjectionKey<T> = Symbol(),
  defaultValue?: any,
): ShallowUnwrap<T> {
  // TODO: 获取可能存在获取不到情况
  return inject(
    key,
    defaultValue ||
      (() => {
        warn('key获取注入值失败')
      }) ||
      {},
  )
}
