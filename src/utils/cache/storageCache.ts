import { AesEncryption, EncryptionParams } from '/@/utils/cipher'
/**
 * Storage 具体实现 并进行加解密
 */

import { cacheCipher } from '/@/settings/encryptionSetting'
import { isNullAndUnDef } from '/@/utils/is'

export interface CreateStorageParams extends EncryptionParams {
  prefixKey: string // key前缀
  storage: Storage // 存储类型  sessionStorage  localStorage
  hasEncrypt: boolean // 是否加密
  timeout?: Nullable<number> // 过期时间
}

export const createStorage = ({
  prefixKey = '',
  storage = sessionStorage,
  key = cacheCipher.key,
  iv = cacheCipher.iv,
  timeout = null,
  hasEncrypt = true,
}: Partial<CreateStorageParams> = {}) => {
  // 由于对称解密使用的算法是 AES-128-CBC算法，数据采用 PKCS#7 填充 ， 因此这里的 key 需要为16位！
  if (hasEncrypt && [key.length, iv.length].some(item => item != 16)) {
    throw new Error('当进行加密时，key/iv 必须为16位')
  }

  // 创建aes 加解密对象
  const encryption = new AesEncryption({ key, iv })

  /**
   * Cache 类
   * 构造参数可以传递到sessionStorage, localStorage，
   */
  const WebStorage = class WEbStorage {
    // 定义属性
    private storage: Storage
    private prefixKey?: string
    private encryption: AesEncryption // 加解密类
    private hasEncrypt: boolean // 是否加密

    constructor() {
      this.storage = storage
      this.prefixKey = prefixKey
      this.encryption = encryption
      this.hasEncrypt = hasEncrypt
    }

    /**
     *  获取浏览器存储的键
     * @param key 键
     * @returns 重组的键
     */
    private getKey(key: string) {
      return `${this.prefixKey}${key}`.toUpperCase()
    }

    /**
     * 设置storage (LocalStorage,SessionStorage)
     * @param key 键
     * @param value 值
     * @param expire 过期时间
     */
    set(key: string, value: any, expire: number | null = timeout) {
      const stringData = JSON.stringify({
        value,
        time: Date.now(),
        expire: !isNullAndUnDef(expire) ? new Date().getTime() + expire * 1000 : null,
      })
      // 是否对数据进行加密
      const stringifyValue = this.hasEncrypt ? this.encryption.encryptByAES(stringData) : stringData
      // 将数据存储在浏览器本地
      this.storage.setItem(this.getKey(key), stringifyValue)
    }

    /**
     *  根据键获取存储值，并判断是否已过期
     * @param key 键
     * @param def 返回默认值null
     * @returns 值 或者  默认值null
     */
    get(key: string, def: any = null): any {
      const val = this.storage.getItem(this.getKey(key))
      if (!val) return def
      try {
        const decVal = this.hasEncrypt ? this.encryption.encryptByAES(val) : val
        const data = JSON.parse(decVal)
        const { value, expire } = data
        if (isNullAndUnDef(expire) || expire >= new Date().getTime()) {
          return value
        }
        // 过期删除
        this.remove(key)
      } catch (e) {
        return def
      }
    }

    /**
     * 通过键名 删除本地存储
     * @param key 键
     */
    remove(key: string) {
      this.storage.removeItem(this.getKey(key))
    }

    /**
     * 删除本地所有存储
     */
    clear(): void {
      this.storage.clear()
    }
  }

  return new WebStorage()
}
