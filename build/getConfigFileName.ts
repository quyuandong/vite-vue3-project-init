/**
 *  获取配置文件变量名  简称，用于配置文件名字
 * @param env 环境变量
 * @returns 配置文件变量名
 */
export const getConfigFileName = (env: Record<string, any>) => {
  return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || '__APP'}__CONF__`
    .toUpperCase()
    .replace(/\s/g, '')
}
