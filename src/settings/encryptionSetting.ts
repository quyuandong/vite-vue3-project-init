/**
 * 加密相关配置
 */

import { isDevMode } from '/@/utils/env'

// 系统默认的缓存时间，单位为秒
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7

// aes加密密钥
export const cacheCipher = {
  key: '_11111000001111@', //秘钥
  iv: '@11111000001111_', // 秘钥偏移量
}

//  系统缓存是否使用aes加密 开发模式不加密，生产加密
export const enableStorageEncryption = !isDevMode()
