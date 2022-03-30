/**
 * mock 开发环境 或 生产环境
 * https://github.com/anncwb/vite-plugin-mock
 */
import { viteMockServe } from 'vite-plugin-mock'

export function configMockPlugin(isBuild: boolean) {
  return viteMockServe({
    ignore: /^\_/, //忽略以_开头的文件
    mockPath: 'mock', //mock文件地址
    localEnabled: !isBuild, // 开发 是否打包mock
    prodEnabled: isBuild, // 生产 是否打包mock

    // 如果生产环境开启了 mock 功能,即prodEnabled=true.则该代码会被注入到injectFile对应的文件的底部。默认为main.{ts,js}
    // 这样做的好处是,可以动态控制生产环境是否开启 mock 且在没有开启的时候 mock.js 不会被打包。
    // 如果代码直接写在main.ts内，则不管有没有开启,最终的打包都会包含mock.js
    injectCode: `
      import { setupProdMockServer } from '../mock/_createProductionServer';
      setupProdMockServer();
      `,
    logger: true, // 是否在控制台显示请求日志
    supportTs: false, // 是否紧支持 读取ts文件
    watchFiles: true, //设置是否监视mockPath对应的文件夹内文件中的更改
  })
}
