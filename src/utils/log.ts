/**
 * 日志输出信息相关的工具
 */

// 项目名称
const projectName = import.meta.env.VITE_GLOB_APP_TITLE

/**
 * 控制台输出警告信息
 * @param message 消息
 */
export function warn(message: string) {
  console.warn(`[${projectName} warn]:${message}`)
}

/**
 * 抛出异常信息
 * @param message 消息
 */
export function error(message: string) {
  throw new Error(`[${projectName} warn]:${message}`)
}
