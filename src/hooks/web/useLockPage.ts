import { computed, unref } from 'vue'
/**
 * 锁屏相关的hook
 */

import { useThrottleFn } from '@vueuse/core'
import { onUnmounted, watchEffect } from 'vue'
import { useRootSetting } from '../setting/useRootSetting'
import { useAppStore } from '/@/store/modules/app'
import { useLockStore } from '/@/store/modules/lock'
import { useUserStore } from '/@/store/modules/user'

// 创建一个锁定屏幕监视器
export function useLockPage() {
  const { getLockTime } = useRootSetting()
  const lockStore = useLockStore()
  const userStore = useUserStore()
  const appStore = useAppStore()

  let timeId: TimeoutHandle

  function clear(): void {
    window.clearTimeout(timeId)
  }

  function resetCalcLockTimeout(): void {
    // 没有登陆退出
    if (!userStore.getToken) {
      clear()
      return
    }

    const lockTime = appStore.getProjectConfig.lockTime

    if (!lockTime || lockTime < 1) {
      clear()
      return
    }

    clear()

    timeId = setTimeout(() => {
      lockPage()
    }, lockTime * 60 * 1000)
  }

  // 设置锁屏
  function lockPage(): void {
    lockStore.setLockInfo({
      isLock: true,
      pwd: undefined,
    })
  }

  // 监控token
  watchEffect(onClean => {
    if (userStore.getToken) {
      resetCalcLockTimeout()
    } else {
      clear()
    }
    onClean(() => {
      clear()
    })
  })

  // 销毁时 去掉定时器
  onUnmounted(() => clear())

  const keyupFn = useThrottleFn(resetCalcLockTimeout, 2000)

  return computed(() => {
    if (unref(getLockTime)) {
      return { onKeyup: keyupFn, onMousemove: keyupFn }
    } else {
      clear()
      return {}
    }
  })
}
