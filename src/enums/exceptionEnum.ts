/**
 * 异常相关的枚举
 */

// 常见的异常
export enum ExceptionEnum {
  PAGE_NOT_ACCESS = 403, //页面不能访问
  PAGE_NOT_FOUND = 404, // 页面未找到
  ERROR = 500, // 服务器异常
  NET_WORK_ERROR = 10000, //网络异常
  PAGE_NOT_DATA = 10100, // 页面没有数据
}

// 常见的错误类型
export enum ErrorTypeEnum {
  VUE = 'vue',
  SCRIPT = 'script',
  RESOURCE = 'resource',
  AJAX = 'ajax',
  PROMISE = 'promise',
}
