import { getStorageShortName } from '/@/utils/env'
import { DEFAULT_CACHE_TIME, enableStorageEncryption } from '/@/settings/encryptionSetting'
/**
 *  创建storage  localStorage sessionStorage 入口
 */
import { createStorage as create, CreateStorageParams } from './storageCache'

// 参数类型
export type Options = Partial<CreateStorageParams>

/**
 * 创建参数集
 * @param storage 本地存储
 * @param options 参数
 * @returns
 */
const createOptions = (storage: Storage, options: Options = {}): Options => {
  return {
    hasEncrypt: enableStorageEncryption,
    storage,
    prefixKey: getStorageShortName(),
    ...options,
  }
}

/**
 * 默认创建sessionStore 使用默认参数
 */
export const WebStorage = create(createOptions(sessionStorage))

/**
 * 自定义默认创建 本地存储 （使用默认参数 + 自定义参数）
 * @param storage 仓储
 * @param options 参数
 * @returns
 */
export const createStorage = (storage: Storage = sessionStorage, options: Options = {}) => {
  return create(createOptions(storage, options))
}

/**
 * 创建使用默认过期时间的sessionStorage
 * @param options 参数
 * @returns
 */
export const createSessionStorage = (options: Options = {}) => {
  return createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}

/**
 *  创建使用默认过期时间的localStorage
 * @param options 参数
 * @returns
 */
export const createLocalStorage = (options: Options = {}) => {
  return createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}

export default WebStorage
