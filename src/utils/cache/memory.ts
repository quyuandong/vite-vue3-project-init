/**
 * cache 存储 缓存
 */

export interface Cache<U = any> {
  value?: U
  timeoutId?: TimeoutHandle // 定时器
  time?: number
  alive?: number
}

const NOT_ALIVE = 0 // cache 有效期

export class Memory<T = any, U = any> {
  private cache: { [key in keyof T]?: Cache<U> } = {}
  private alive: number // 过期时间

  // 构造器
  constructor(alive = NOT_ALIVE) {
    this.alive = alive * 1000
  }

  get getCache() {
    return this.cache
  }

  setCache(cache) {
    this.cache = cache
  }
  /**
   * 获取缓存中的数据
   * @param key 键名
   * @returns 返回对应的值
   */
  get<K extends keyof T>(key: K) {
    return this.cache[key]
  }

  /**
   * 设置缓存
   * @param key 键名
   * @param value 值
   * @param expires 过期时间
   * @returns 返回值
   */
  set<K extends keyof T>(key: K, value: U, expires?: number) {
    // 查看是否已经存储
    let item = this.get(key)

    // 是否设置当前cache过期时间为默认时间
    if (!expires || expires <= 0) {
      expires = this.alive
    }

    if (item) {
      if (item.timeoutId) {
        clearTimeout(item.timeoutId)
        item.timeoutId = undefined
      }
      item.value = value
    } else {
      item = { value, alive: expires }
      this.cache[key] = item
    }

    if (!expires) {
      return value
    }

    const now = new Date().getTime()
    item.time = now + this.alive
    item.timeoutId = setTimeout(
      () => {
        this.remove(key)
      },
      expires > now ? expires - now : expires,
    )
  }

  /**
   *  移除cache
   * @param key  键名
   * @returns 返回移除前的值
   */
  remove<K extends keyof T>(key: K) {
    const item = this.get(key)
    Reflect.deleteProperty(this.cache, key)
    if (item) {
      clearTimeout(item.timeoutId!)
      return item.value
    }
  }

  /**
   *  重置cache
   * @param cache 要重置的cache
   */
  resetCache(cache: { [K in keyof T]: Cache }) {
    Object.keys(cache).forEach(key => {
      const k = key as any as keyof T
      const item = cache[k]
      if (item && item.time) {
        const now = new Date().getTime()
        const expire = item.time
        if (expire > now) {
          this.set(k, item.value, expire)
        }
      }
    })
  }

  /**
   * 清除所有的缓存
   */
  clear() {
    Object.keys(this.cache).forEach(key => {
      const item = this.cache[key]
      item.timeoutId && clearTimeout(item.timeoutId)
    })
    this.cache = {}
  }
}
