/**
 * vite所需插件入口
 */

import { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue' //vue插件,提供vue3支持
import vueJsx from '@vitejs/plugin-vue-jsx' //通过 HMR 提供 Vue 3 JSX 和 TSX 支持。
import legacy from '@vitejs/plugin-legacy' //兼容老版本浏览器问题
import purgeIcons from 'vite-plugin-purge-icons'
import { configSvgIconsPlugin } from './svgSprite'
import windiCSS from 'vite-plugin-windicss'
import { configThemePlugin } from './theme'
import { configHtmlPlugin } from './html'
import { configMockPlugin } from './mock'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { configStyleImportPlugin } from './styleImport'
import { configVisualizerConfig } from './visualizer'
import { configImageminPlugin } from './imagemin'
import { configCompressPlugin } from './compress'
import { configPwaConfig } from './pwa'

/**
 *
 * @param viteEnv 环境变量
 * @param isBuild 是否是生产环境
 */
export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const {
    VITE_LEGACY,
    VITE_USE_MOCK,
    VITE_USE_IMAGEMIN,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
  } = viteEnv
  const vitePlugins: (Plugin | Plugin[])[] = [
    // Vue 3 单文件组件支持
    vue(),
    // Vue 3 JSX支持
    vueJsx(),
    // 支持 组件component 的name
    // support name
    vueSetupExtend(),
  ]

  // vite-plugin-windicss
  vitePlugins.push(windiCSS())

  // TODO: 插件

  // @vitejs/plugin-legacy 是否兼容老的浏览器
  VITE_LEGACY && isBuild && vitePlugins.push(legacy())

  // vite-plugin-html  用于 html 模版转换，可以在html文件内进行书写模版语法
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))

  // vite-plugin-svg-icons 制作雪碧图
  vitePlugins.push(configSvgIconsPlugin(isBuild))

  // vite-plugin-mock 用于本地及开发环境数据 mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild))

  // vite-plugin-purge-icons 可快速创建SVG精灵
  vitePlugins.push(purgeIcons())

  // vite-plugin-style-import 按需导入组件样式
  vitePlugins.push(configStyleImportPlugin(isBuild))

  // rollup-plugin-visualizer 打包分析插件
  vitePlugins.push(configVisualizerConfig())

  //vite-plugin-theme 主题相关的插件
  vitePlugins.push(configThemePlugin(isBuild))

  // 以下插件只能在生产环境中工作
  if (isBuild) {
    //vite-plugin-imagemin 图片压缩
    VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin())

    // rollup-plugin-gzip 用于打包和输出gzip。 注意，这在Vite中不能正常工作，具体原因仍在调查中
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE),
    )

    // vite-plugin-pwa 配置 https://vite-plugin-pwa.netlify.app/guide/#installation
    vitePlugins.push(configPwaConfig(viteEnv))
  }

  return vitePlugins
}
