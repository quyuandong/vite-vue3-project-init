/**
 *  crypto-js aes 加解密
 */
import { encrypt, decrypt } from 'crypto-js/aes'
import { parse } from 'crypto-js/enc-utf8'
import pkcs7 from 'crypto-js/pad-pkcs7'
import ECB from 'crypto-js/mode-ecb'
import UTF8 from 'crypto-js/enc-utf8'

//加密的参数类型定义
export interface EncryptionParams {
  key: string // 秘钥
  iv: string // 秘钥偏移量
}

/**
 * 对称加解密算法
 */
export class AesEncryption {
  private key // 密钥
  private iv //密钥偏移量

  // 构造器
  constructor(opt: Partial<EncryptionParams> = {}) {
    const { key, iv } = opt

    // 转为utf-8 并进行赋值
    if (key) {
      this.key = parse(key)
    }
    if (iv) {
      this.iv = parse(iv)
    }
  }
  /**
   * 获取参数配置
   */
  get getOptions() {
    return {
      mode: ECB,
      padding: pkcs7,
      iv: this.iv,
    }
  }

  /**
   * aes 加密
   * @param cipherText 明文
   * @returns 加密后的密文
   */
  encryptByAES(cipherText: string) {
    return encrypt(cipherText, this.key, this.getOptions).toString()
  }

  /**
   *  aes 解密
   * @param cipherText 密文
   * @returns 明文 （utf8）
   */
  decryptByAES(cipherText: string) {
    return decrypt(cipherText, this.key, this.getOptions).toString(UTF8)
  }
}
