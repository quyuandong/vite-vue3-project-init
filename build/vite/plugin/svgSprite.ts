/**
 * Vite插件，快速创建SVG精灵。Vite插件，快速创建SVG精灵。
 * https://github.com/anncwb/vite-plugin-svg-icons
 */

import path from 'path'
import SvgIconsPlugin from 'vite-plugin-svg-icons'

export function configSvgIconsPlugin(isBuild: boolean) {
  const svgIconsPlugin = SvgIconsPlugin({
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    svgoOptions: isBuild,
    symbolId: 'icon-[dir]-[name]',
  })
  return svgIconsPlugin
}
