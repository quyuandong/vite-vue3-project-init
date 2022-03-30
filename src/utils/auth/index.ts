import { Persistent } from '/@/utils/cache/persistent'
/**
 * 权限缓存 方法集合
 */

import { BasicKeys } from '/@/utils/cache/persistent'
import projectSetting from '/@/settings/projectSetting'
import { CacheTypeEnum, TOKEN_KEY } from '/@/enums/cacheEnum'

const { permissionCacheType } = projectSetting

// 是否是localStorage 存储
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL

/**
 * 获取权限缓存
 * @param key 键
 * @returns
 */
export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession
  return fn(key) as T
}

/**
 * 设置权限缓存
 * @param key 键
 * @param value 值
 * @returns
 */
export function setAuthCache(key: BasicKeys, value) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession
  return fn(key, value, true)
}

/**
 * 清除所有的权限缓存
 * @param immediate 是否立即
 * @returns
 */
export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession
  return fn(immediate)
}

/**
 * 获取本地缓存的token信息
 * @returns token
 */
export function getToken() {
  return getAuthCache(TOKEN_KEY)
}
