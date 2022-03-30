/**
 * 异步导入组件
 */

import { Spin } from 'ant-design-vue'
import { defineAsyncComponent } from 'vue'
import { noop } from '/@/utils'

interface Options {
  size?: 'default' | 'small' | 'large' // 加载动画大小
  delay?: number // 延迟时间
  timeout?: number //超市时间
  loading?: boolean //是否加载动画
  retry?: boolean // 是否重试
}

export function createAsyncComponent(loader: Fn, options: Options = {}) {
  const { size = 'small', delay = 100, timeout = 30000, loading = false, retry = true } = options
  return defineAsyncComponent({
    loader,
    loadingComponent: loading ? <Spin spinning={true} size={size} /> : undefined,
    timeout,
    delay,
    onError: !retry
      ? noop
      : (error, retry, fail, attempts) => {
          if (error.message.match(/fetch/) && attempts <= 3) {
            // 获取错误时重试3次
            retry()
          } else {
            // 请注意，重试/失败类似于一个承诺的解决/拒绝:
            // 要继续进行错误处理，必须调用其中一个。
            fail()
          }
        },
  })
}
