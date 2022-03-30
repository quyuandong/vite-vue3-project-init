// 是否是开发环境
export function isDevFn(mode: string): boolean {
  return mode === 'development'
}

// 是否是生产环境
export function isProdFn(mode: string): boolean {
  return mode === 'production'
}

// 是否生成包预览
export function isReportMode(): boolean {
  return process.env.REPORT === 'true'
}
