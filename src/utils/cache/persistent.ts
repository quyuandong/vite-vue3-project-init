/**
 *  本地持久化一些常用方法
 *  localStorage sessionStorage
 */

import { createLocalStorage, createSessionStorage } from './index'
import { RouteLocationNormalized } from 'vue-router'
import { Memory } from './memory'
import { ProjectConfig } from '/#/config'
import { LockInfo, UserInfo } from '/#/store'
import {
  APP_LOCAL_CACHE_KEY,
  APP_SESSION_CACHE_KEY,
  LOCALE_KEY,
  LOCK_INFO_KEY,
  MULTIPLE_TABS_KEY,
  PROJ_CFG_KEY,
  ROLES_KEY,
  TOKEN_KEY,
  USER_INFO_KEY,
} from '/@/enums/cacheEnum'
import { DEFAULT_CACHE_TIME } from '/@/settings/encryptionSetting'
import { toRaw } from 'vue'
import { pick, omit } from 'lodash-es'

interface BasicStore {
  [TOKEN_KEY]: string | number | null | undefined
  [USER_INFO_KEY]: UserInfo
  [ROLES_KEY]: string[]
  [LOCK_INFO_KEY]: LockInfo
  [PROJ_CFG_KEY]: ProjectConfig
  [MULTIPLE_TABS_KEY]: RouteLocationNormalized[]
}

export type BasicKeys = keyof BasicStore

type LocalStore = BasicStore
type SessionStore = BasicStore

type LocalKeys = keyof LocalStore
type SessionKeys = keyof SessionStore

const localMemory = new Memory(DEFAULT_CACHE_TIME)
const sessionMemory = new Memory(DEFAULT_CACHE_TIME)

const ls = createLocalStorage()
const ss = createSessionStorage()

/**
 * 初始化存储 - 将浏览器存储 拿到 内存中
 */
function initPersistentMemory() {
  const localCache = ls.get(APP_LOCAL_CACHE_KEY)
  const sessionCache = ss.get(APP_SESSION_CACHE_KEY)
  localCache && localMemory.resetCache(localCache)
  sessionCache && sessionMemory.resetCache(sessionCache)
}

export class Persistent {
  /**
   * 获取session
   * @param key 键
   * @returns
   */
  static getLocal<T>(key: LocalKeys) {
    return localMemory.get(key)?.value as Nullable<T>
  }

  static setLocal(key: LocalKeys, value: LocalStore[LocalKeys], immediate = false): void {
    // toRaw 不需要更新UI界面
    localMemory.set(key, toRaw(value))
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache)
  }

  static removeLocal(key: LocalKeys, immediate = false): void {
    localMemory.remove(key)
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache)
  }

  static clearLocal(immediate = false): void {
    localMemory.clear()
    immediate && ls.clear()
  }

  static getSession<T>(key: SessionKeys) {
    return sessionMemory.get(key)?.value as Nullable<T>
  }

  static setSession(key: SessionKeys, value: SessionStore[SessionKeys], immediate = false): void {
    sessionMemory.set(key, toRaw(value))
    immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache)
  }

  static removeSession(key: SessionKeys, immediate = false): void {
    sessionMemory.remove(key)
    immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache)
  }
  static clearSession(immediate = false): void {
    sessionMemory.clear()
    immediate && ss.clear()
  }

  static clearAll(immediate = false) {
    sessionMemory.clear()
    localMemory.clear()
    if (immediate) {
      ls.clear()
      ss.clear()
    }
  }
}

/**
 * // 当浏览器窗口关闭或者刷新时，会触发beforeunload事件。
 */
window.addEventListener('beforeunload', function () {
  // TOKEN_KEY 在登录或注销时已经写入到storage了，此处为了解决同时打开多个窗口时token不同步的问题
  // LOCK_INFO_KEY 在锁屏和解锁时写入，此处也不应修改

  ls.set(APP_LOCAL_CACHE_KEY, {
    // 删除 LOCK_INFO_KEY 属性
    ...omit(localMemory.getCache, LOCK_INFO_KEY),
    // 对[TOKEN_KEY, USER_INFO_KEY, LOCK_INFO_KEY] 赋 localStorage中的值
    ...pick(ls.get(APP_LOCAL_CACHE_KEY), [TOKEN_KEY, USER_INFO_KEY, LOCK_INFO_KEY]),
  })

  ss.set(APP_SESSION_CACHE_KEY, {
    ...omit(sessionMemory.getCache, LOCK_INFO_KEY),
    ...pick(ss.get(APP_SESSION_CACHE_KEY), [TOKEN_KEY, USER_INFO_KEY, LOCK_INFO_KEY]),
  })
})

/**
 * 监控 web 中storage 存储的变化 进行清空本地存储
 */
window.addEventListener('storage', function (e) {
  const { key, newValue, oldValue } = e
  if (!key) {
    Persistent.clearAll()
    return
  }
  if (!!newValue && !!oldValue) {
    if (APP_LOCAL_CACHE_KEY === key) {
      Persistent.clearLocal()
    }
    if (APP_SESSION_CACHE_KEY === key) {
      Persistent.clearSession()
    }
  }
})

//  初始化存储  将本地的存储 拿到缓存中
initPersistentMemory()
