import { isEqual } from 'lodash-es'
import { tryOnMounted, tryOnUnmounted } from '@vueuse/core'
import {
  computed,
  getCurrentInstance,
  reactive,
  ref,
  unref,
  toRaw,
  watchEffect,
  nextTick,
} from 'vue'
import {
  DrawerInstance,
  DrawerProps,
  ReturnMethods,
  UseDrawerInnerReturnType,
  UseDrawerReturnType,
} from './typing'
import { isProdMode } from '/@/utils/env'
import { error } from '/@/utils/log'
import { isFunction } from '/@/utils/is'

const dataTransferRef = reactive<any>({})

const visibleData = reactive<{ [key: number]: boolean }>({})

// 使用抽屉 --  适用于分割抽屉及外呼
export function useDrawer(): UseDrawerReturnType {
  if (!getCurrentInstance()) {
    throw new Error('“useDrawer()” 只能在 【setup() 或 function】 组件中使用！')
  }

  const drawer = ref<DrawerInstance | null>(null)
  const loaded = ref<Nullable<Boolean>>(false)
  const uid = ref<string>('')

  // 抽屉注册
  function register(drawerInstance: DrawerInstance, uuid: string) {
    // 是否是生产模式
    isProdMode() &&
      tryOnMounted(() => {
        drawer.value = null
        loaded.value = null
        dataTransferRef[unref(uid)] = null
      })

    if (unref(loaded) && isProdMode() && drawerInstance === unref(drawer)) {
      return
    }

    uid.value = uuid
    drawer.value = drawerInstance
    loaded.value = true

    drawerInstance.emitVisible = (visible: boolean, uid: number) => {
      visibleData[uid] = visible
    }
  }

  // 获取实例
  const getInstance = () => {
    const instance = unref(drawer)
    if (!instance) {
      error('抽屉实例 undefine')
    }
    return instance
  }

  // 暴露方法
  const methods: ReturnMethods = {
    openDrawer: function <T = any>(visible = true, data?: T, openOnSet = true): void {
      getInstance()?.setDrawerProps({
        visible: visible,
      })

      if (!data) return

      // 是否打开后进行数据设置
      if (openOnSet) {
        dataTransferRef[unref(uid)] = null
        dataTransferRef[unref(uid)] = toRaw(data)
        return
      }

      const equal = isEqual(toRaw(dataTransferRef[unref(uid)]), toRaw(data))
      if (!equal) {
        dataTransferRef[unref(uid)] = toRaw(data)
      }
    },
    // 关闭抽屉
    closeDrawer: function (): void {
      getInstance()?.setDrawerProps({ visible: false })
    },
    // 设置抽屉参数
    setDrawerProps: function (props: Partial<DrawerProps>): void {
      getInstance()?.setDrawerProps(props)
    },
    // 当前抽屉是否显示
    getVisible: computed(() => {
      // ~~ 利用符号进行的类型转换,转换成数字类型 ~~"" == 0;
      return visibleData[~~unref(uid)]
    }),
  }

  return [register, methods]
}

/**
 *
 * @param callbackFn
 * @returns
 */
export const useDrawerInner = (callbackFn?: Fn): UseDrawerInnerReturnType => {
  if (!getCurrentInstance()) {
    throw new Error('“useDrawer()” 只能在 【setup() 或 function】 组件中使用！')
  }

  const drawerInstanceRef = ref<Nullable<DrawerInstance>>(null)
  const currentInstance = getCurrentInstance()
  const uidRef = ref<string>('')

  const getInstance = () => {
    const instance = unref(drawerInstanceRef)
    if (!instance) {
      error('当前抽屉实例不存在!')
      return
    }
    return instance
  }

  const register = (modalInstance: DrawerInstance, uuid: string) => {
    isProdMode() &&
      tryOnUnmounted(() => {
        drawerInstanceRef.value = null
      })

    uidRef.value = uuid
    drawerInstanceRef.value = modalInstance
    currentInstance?.emit('register', modalInstance, uuid)
  }

  watchEffect(() => {
    const data = dataTransferRef[unref(uidRef)]
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
        getInstance()?.setDrawerProps({ loading })
      },

      changeOkLoading: (loading = true) => {
        getInstance()?.setDrawerProps({ confirmLoading: loading })
      },
      getVisible: computed((): boolean => {
        return visibleData[~~unref(uidRef)]
      }),

      closeDrawer: () => {
        getInstance()?.setDrawerProps({ visible: false })
      },

      setDrawerProps: (props: Partial<DrawerProps>) => {
        getInstance()?.setDrawerProps(props)
      },
    },
  ]
}
