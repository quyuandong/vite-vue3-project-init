import { tryOnUnmounted } from '@vueuse/core'
import { isEqual } from 'lodash-es'
import { computed, nextTick, toRaw, unref, watchEffect } from 'vue'
/**
 * 弹框
 */

import { getCurrentInstance, onUnmounted, reactive, ref } from 'vue'
import {
  ModalMethods,
  ModalProps,
  ReturnMethods,
  UseModalInnerReturnType,
  useModalReturnType,
} from '../typing'
import { isProdMode } from '/@/utils/env'
import { isFunction } from '/@/utils/is'
import { error } from '/@/utils/log'

const dataTransfer = reactive<any>({})
const visibleData = reactive<{ [key: number]: boolean }>({})

// 适用于独立模态和外呼
export function useModal(): useModalReturnType {
  const modal = ref<Nullable<ModalMethods>>(null)
  const loaded = ref<Nullable<boolean>>(false)
  const uid = ref<string>('')

  // 注册一个弹框
  function register(modalMethod: ModalMethods, uuid: string) {
    if (!getCurrentInstance()) {
      throw new Error('useModal() 外呼弹框没有使用')
    }
    uid.value = uuid

    isProdMode() &&
      onUnmounted(() => {
        modal.value = null
        loaded.value = false
        dataTransfer[unref(uid)] = null
      })

    if (unref(loaded) && isProdMode() && modalMethod === unref(modal)) return

    modal.value = modalMethod
    loaded.value = true
    modalMethod.emitVisible = (visible: boolean, uid: number) => {
      visibleData[uid] = visible
    }
  }

  // 获取当前实例
  const getInstance = () => {
    const instance = unref(modal)
    if (!instance) {
      error('useModal instance is undefined!')
    }
    return instance
  }

  // 弹框的方法
  const methods: ReturnMethods = {
    // 设置props
    setModalProps: (props: Partial<ModalProps>): void => {
      getInstance()?.setModalProps(props)
    },
    // 获取是否显示
    getVisible: computed((): boolean => {
      // ~~ 强制转换成int
      return visibleData[~~unref(uid)]
    }),
    // 重置高度
    redoModalHeight: () => {
      getInstance()?.redoModalHeight?.()
    },
    // 打开弹框
    openModal: <T = any>(visible = true, data?: T, openOnSet = true): void => {
      getInstance()?.setModalProps({ visible: visible })
      if (!data) return
      const id = unref(uid)
      if (openOnSet) {
        dataTransfer[id] = null
        dataTransfer[id] = toRaw(data)
        return
      }
      const equal = isEqual(toRaw(dataTransfer[id]), toRaw(data))
      if (!equal) {
        dataTransfer[id] = toRaw(data)
      }
    },
    closeModal: () => {
      getInstance()?.setModalProps({ visible: false })
    },
  }
  return [register, methods]
}

// 使用内部弹框
export const useModalInner = (callbackFn?: Fn): UseModalInnerReturnType => {
  const modalInstanceRef = ref<Nullable<ModalMethods>>(null)
  const currentInstance = getCurrentInstance()
  const uidRef = ref<string>('')

  const getInstance = () => {
    const instance = unref(modalInstanceRef)
    if (!instance) {
      error('useModalInner instance is undefined!')
    }
    return instance
  }

  const register = (modalInstance: ModalMethods, uuid: string) => {
    isProdMode() &&
      tryOnUnmounted(() => {
        modalInstanceRef.value = null
      })
    uidRef.value = uuid
    modalInstanceRef.value = modalInstance
    currentInstance?.emit('register', modalInstance, uuid)
  }

  watchEffect(() => {
    const data = dataTransfer[unref(uidRef)]
    if (!data) return
    if (!callbackFn || !isFunction(callbackFn)) return
    nextTick(() => {
      callbackFn(data)
    })
  })

  return [
    register,
    {
      changeLoading: (loading = true) => {
        getInstance()?.setModalProps({ loading })
      },
      getVisible: computed((): boolean => {
        return visibleData[~~unref(uidRef)]
      }),

      changeOkLoading: (loading = true) => {
        getInstance()?.setModalProps({ confirmLoading: loading })
      },

      closeModal: () => {
        getInstance()?.setModalProps({ visible: false })
      },

      setModalProps: (props: Partial<ModalProps>) => {
        getInstance()?.setModalProps(props)
      },

      redoModalHeight: () => {
        const callRedo = getInstance()?.redoModalHeight
        callRedo && callRedo()
      },
    },
  ]
}
