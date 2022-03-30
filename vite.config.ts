import { ConfigEnv, loadEnv, UserConfig } from 'vite'
import pkg from './package.json'
import moment from 'moment'
import { wrapperEnv } from './src/utils'
import { resolve } from 'path'
import { createVitePlugins } from './build/vite/plugin'
import { createProxy } from './build/vite/proxy'
import { OUTPUT_DIR } from './build/constant'
import { generateModifyVars } from './build/generate/generateModifyVars'
//TODO: 后续使用。 插件 - 自动生成 vue 组件文档网站。 //  https://meetqy.github.io/vite-plugin-vue-docs/#/docs

// 获取依赖，名称，版本  （系统的一些信息）
const { dependencies, devDependencies, name, version } = pkg
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: moment().format('YYYY-MM-DD HH:mm:ss'),
}

/**
 * 获取绝对路径
 * @param dir 文件名字
 * @returns 获取完整的路径名字
 */
function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

/**
 * vite配置
 * @param command 环境模式  开发模式(serve),生产(build))
 * @param mode 当前的环境变量集合
 * @returns
 */
export default ({ command, mode }: ConfigEnv): UserConfig => {
  //获取当前Node.js进程执行时的工作目录（当前项目目录： F:\my_resource_project\vite-vue-3）
  const root = process.cwd()

  // 根据不同的环境 读取不同的对象
  const env = loadEnv(mode, root)

  // 环境数据处理（格式，类型等）
  const viteEnv = wrapperEnv(env)

  const { VITE_PUBLIC_PATH, VITE_PORT, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv

  // 当时是否是生产环境
  const isBuild = command === 'build'

  return {
    base: VITE_PUBLIC_PATH, //开发或生产环境服务的公共基础路径
    root, //项目根目录（index.html 文件所在的位置）
    resolve: {
      // 文件系统别名
      alias: [
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
      ],
    },

    // 插件，由于插件数量大，故抽离处理
    plugins: createVitePlugins(viteEnv, isBuild),

    // 开发服务配置
    server: {
      host: true, // 监听所有的
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
    },

    // 构建服务配置
    build: {
      target: 'es2015',
      outDir: OUTPUT_DIR,
      terserOptions: {
        // 自定义压缩选项
        compress: {
          keep_infinity: true, // 以防止Infinity被压缩成1/0
          drop_console: VITE_DROP_CONSOLE, // 移除console.log
        },
      },
      brotliSize: false, //启用/禁用 brotli 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
      chunkSizeWarningLimit: 2000, //chunk 大小警告的限制
    },

    // 定义全局常量替换方式。其中每项在开发环境下会被定义在全局，而在构建时被静态替换
    define: {
      // 设置vue-i18-next，避免报错信息
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars(),
          javascriptEnabled: true,
        },
      },
    },
    optimizeDeps: {
      // @iconify/iconify: The dependency is dynamically and virtually loaded by @purge-icons/generated, so it needs to be specified explicitly
      include: [
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'moment/dist/locale/zh-cn',
        'ant-design-vue/es/locale/en_US',
        'moment/dist/locale/eu',
      ],
      exclude: ['vue-demi', 'consolidate'],
    },
  }
}
