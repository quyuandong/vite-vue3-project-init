/**
 * 锁屏相关的store
 */

import { defineStore } from 'pinia'
import { useUserStore } from './user'
import type { LockInfo } from '/#/store'
import { LOCK_INFO_KEY } from '/@/enums/cacheEnum'
import { Persistent } from '/@/utils/cache/persistent'

interface LockState {
  lockInfo: Nullable<LockInfo>
}

export const useLockStore = defineStore({
  id: 'app-lock',
  state: (): LockState => ({
    lockInfo: Persistent.getLocal(LOCK_INFO_KEY),
  }),
  getters: {
    getLockInfo(): Nullable<LockInfo> {
      return this.lockInfo
    },
  },
  actions: {
    // 设置锁屏信息
    setLockInfo(info: LockInfo) {
      this.lockInfo = Object.assign({}, this.lockInfo, info)
      Persistent.setLocal(LOCK_INFO_KEY, this.lockInfo, true)
    },
    // 立即重置锁屏信息
    resetLockInfo() {
      this.lockInfo = null
      Persistent.removeLocal(LOCK_INFO_KEY, true)
    },
    // 解锁
    async unLock(password?: string) {
      const userStore = useUserStore()
      // 密码相等 解锁
      if (this.lockInfo?.pwd === password) {
        this.resetLockInfo()
        return true
      }

      const tryLogin = async () => {
        try {
          const username = userStore.getUserInfo.username
          const res = await userStore.login({
            username,
            password: password!,
            goHome: false,
            mode: 'none',
          })
          if (res) this.resetLockInfo()
        } catch (error) {
          return false
        }
      }

      // 尝试登陆
      return await tryLogin()
    },
  },
})
