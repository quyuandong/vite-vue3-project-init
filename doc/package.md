# 依赖文件中各项解释

> 前言：刚开始接触，以文档形式进行记录，便于学习理解

## 1. 基础配置

- name：系统名字
- version：系统版本
- author：作者相关信息
- scripts：调试相关的配置
- dependencies：生产环境需要的依赖
- devDependencies：测试环境需要的依赖

## 2. 调试配置(scripts)

- dev

  > 测试环境运行。示例：

  ```json
  { "dev": "vite" }
  ```

- build

  > 生产打包。先进行类型检查(不生成输出文件)，然后使用`vite`进行打包。示例：

  ```json
  { "build": "vue-tsc --noEmit && vite build" }
  ```

- preview

  > 本地预览生产构建。（**后续补充**）示例：

  ```json
  { "preview": "vite preview" }
  ```

## 3. 生产依赖详解(dependencies)

- 【ant-design-vue】：ui 组件库
- 【vue】：vue 依赖
- 【vue-router】：路由
- 【ant-design-vue】：ui 组件库
- 【ant-design-vue】：ui 组件库
- 【ant-design-vue】：ui 组件库
- 【ant-design-vue】：ui 组件库
- 【ant-design-vue】：ui 组件库

## 4. 开发依赖详解(devDependencies)

- 【@vitejs/plugin-vue】：ui 组件库
- 【typescript】：ts 支持库
- 【vite】：vite 支持库
- 【vite-plugin-vue-docs】：自动生成 vue 组件文档网站
- 【vue-tsc】：ts 类型检查
- 【ant-design-vue】：ui 组件库
- 【ant-design-vue】：ui 组件库
- 【ant-design-vue】：ui 组件库

eslint 插件相关的校验： https://zhuanlan.zhihu.com/p/388703150
