/**
 * 用于解析.env.development代理配置项
 */
import type { ProxyOptions } from 'vite'
type ProxyItem = [string, string]
type ProxyList = ProxyItem[]
type ProxyTargetList = Record<string, ProxyOptions>

const httpsRE = /^https:\/\//

/**
 * 创建代理
 * @param list 代理列表
 * @returns 处理过的代理
 */
export function createProxy(list: ProxyList = []) {
  const proxy: ProxyTargetList = {}

  //prefix:前缀  target:目标地址
  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target)

    proxy[prefix] = {
      target: target,

      changeOrigin: true, // 是否将主机头的来源更改为目标 URL

      ws: true, //是否想代理 websockets

      rewrite: path => path.replace(new RegExp(`^${prefix}`), ''),

      //   激活对目标连接的安全 SSL 证书的验证（避免自签名证书），只需secure: true在选项中设置即可
      ...(isHttps ? { secure: false } : {}),
    }
  }

  return proxy
}
