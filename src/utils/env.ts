/**
 * 环境变量相关的工具方法
 */

import { getConfigFileName } from '../../build/getConfigFileName'
import { warn } from './log'
import { GlobEnvConfig } from '/#/config'
import pkg from '../../package.json'

/**
 * 获取系统的环境变量配置
 * @returns 环境变量集合
 */
export function getAppEnvConfig() {
  // 简称，用于配置文件名字
  const ENV_NAME = getConfigFileName(import.meta.env)

  const ENV = (import.meta.env.DEV
    ? (import.meta.env as unknown as GlobEnvConfig)
    : window[ENV_NAME]) as unknown as GlobEnvConfig

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
  } = ENV
  // 变量只能为字符/下划线，请在环境变量中修改并重新运行
  if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn('变量只能为字符/下划线，请在环境变量中修改并重新运行!!!')
  }
  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
  }
}

/**
 *  获取存储前缀
 * @returns 系统名 + 环境类型
 */
export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppEnvConfig()
  return `${VITE_GLOB_APP_SHORT_NAME}__${getEnv()}__`.toUpperCase()
}

/**
 * 获取完整的存储名字
 * @returns 系统名 + 环境类型 + 版本
 */
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase()
}

// 开发模式
export const devMode = 'development'

// 生产模式
export const proMode = 'production'

// 获取当前的环境类型
export function getEnv(): string {
  return import.meta.env.MODE
}

/**
 *  是否是开发模式
 * @returns
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV
}

/**
 * 是否是生产模式
 * @returns
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD
}
