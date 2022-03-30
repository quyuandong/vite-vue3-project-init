import { getCurrentInstance, reactive, Ref, shallowRef, watchEffect } from 'vue'

/**
 * 组件传递的所有属性 attrs [属性，样式，事件]
 */
interface Params {
  excludeListeners?: boolean // 是否排除事件
  excludeKeys?: string[] // 要排除的键名
  excludeDefaultKeys?: boolean // 是否去掉默认要排除的键
}

const DEFAULT_EXCLUDE_KEYS = ['class', 'style']
const LISTENER_PREFIX = /^on[A-Z]/

// 将对象转为一个二维数组 【键，值】
export function entries<T>(obj: Recordable<T>): [string, T][] {
  return Object.keys(obj).map((key: string) => [key, obj[key]])
}

export function useAttrs(params: Params = {}): Ref<Recordable> | {} {
  const instance = getCurrentInstance() // 获取当前组件上下文
  if (!instance) return {}

  const { excludeListeners = false, excludeKeys = [], excludeDefaultKeys = true } = params

  const attrs = shallowRef(instance.attrs)
  const allExcludeKeys = excludeKeys.concat(excludeDefaultKeys ? DEFAULT_EXCLUDE_KEYS : [])

  // 因为attrs不是响应式，所以让它是响应式的
  instance.attrs = reactive(instance.attrs)

  watchEffect(() => {
    const res = entries(instance.attrs).reduce((acm, [key, val]) => {
      if (!allExcludeKeys.includes(key) && !(excludeListeners && LISTENER_PREFIX.test(key))) {
        acm[key] = val
      }
      return acm
    }, {} as Recordable)

    attrs.value = res
  })

  return attrs
}
