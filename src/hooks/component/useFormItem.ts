import { isEqual } from 'lodash-es'
import {
  computed,
  DeepReadonly,
  getCurrentInstance,
  nextTick,
  reactive,
  readonly,
  Ref,
  toRaw,
  unref,
  UnwrapRef,
  watchEffect,
  WritableComputedRef,
} from 'vue'

export function useRuleFormItem<T extends Recordable, K extends keyof T, V = UnwrapRef<T[K]>>(
  props: T,
  key?: K,
  changeEvent?,
  emitData?: Ref<any[]>,
): [WritableComputedRef<V>, (val: V) => void, DeepReadonly<V>]
export function useRuleFormItem<T extends Recordable>(
  props: T,
  key: keyof T = 'value',
  changeEvent = 'change',
  emitData?: Ref<any[]>,
) {
  // 获取当前组件的实例对象
  const instance = getCurrentInstance()
  const emit = instance?.emit

  const innerState = reactive({
    value: props[key],
  })

  const defaultState = readonly(innerState)

  const setState = (val: UnwrapRef<T[keyof T]>): void => {
    innerState.value = val as T[keyof T]
  }
  watchEffect(() => {
    innerState.value = props[key]
  })

  const state: any = computed({
    get() {
      return innerState.value
    },
    set(val) {
      if (isEqual(val, defaultState.value)) return
      innerState.value = val as T[keyof T]
      nextTick(() => {
        emit?.(changeEvent, val, ...toRaw(unref(emitData) || []))
      })
    },
  })

  return [state, setState, defaultState]
}
