import { darkCssIsReady, loadDarkThemeCss } from 'vite-plugin-theme/es/client'
import { addClass, hasClass, removeClass } from '/@/utils/domUtils'

/**
 * 更新主题模式
 * @param mode 模式（黑暗、亮）
 * @returns
 */
export async function updateDarkTheme(mode: string | null = 'light') {
  const htmlRoot = document.getElementById('htmlRoot')
  if (!htmlRoot) return
  const hasDarkClass = hasClass(htmlRoot, 'dark')
  if (mode === 'dark') {
    if (import.meta.env.PROD && !darkCssIsReady) {
      // 加载灰色主题样式
      await loadDarkThemeCss()
    }
    htmlRoot.setAttribute('data-theme', 'dark')
    if (!hasDarkClass) {
      addClass(htmlRoot, 'dark')
    }
  } else {
    htmlRoot.setAttribute('data-theme', 'light')
    if (hasDarkClass) {
      removeClass(htmlRoot, 'dark')
    }
  }
}
