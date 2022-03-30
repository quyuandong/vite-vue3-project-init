/**
 * 配置和注册全局指令
 */

import { App } from 'vue'
import { setupLoadingDirective } from './loading'

export function setupGlobDirectives(app: App) {
  // 加载动画指令
  setupLoadingDirective(app)
}
