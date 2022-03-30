const docEle = document.documentElement

/**
 * 切换class类
 * @param flag 是否开启切换
 * @param clsName 类名
 * @param target 目标document元素
 */
export function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetEl = target || document.body
  let { className } = targetEl
  className = className.replace(clsName, '')
  targetEl.className = flag ? `${className} ${clsName} ` : className
}

/**
 * 设置全局的css
 * @param prop 属性
 * @param val 样式值
 * @param dom document标签
 */
export function setCssVar(prop: string, val: any, dom = docEle) {
  dom.style.setProperty(prop, val)
}
