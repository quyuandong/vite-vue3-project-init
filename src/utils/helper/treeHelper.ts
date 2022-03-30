/**
 * 与树相关的方法封装
 */

interface TreeHelperConfig {
  id: string
  children: string
  pid: string
}

const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid',
}

// 获取 新的配置文件--（均添加属性）
const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config)

/**
 * 过滤树行结构--（路由）
 * @param tree 路由树
 * @param func 回调方法
 * @param config 参数
 * @returns
 */
export function filter<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {},
): T[] {
  // 将每个config上添加共有属性
  config = getConfig(config)
  const children = config.children as string

  function listFilter(list: T[]) {
    return list
      .map(node => ({ ...node }))
      .filter(node => {
        node[children] = node[children] && listFilter(node[children])
        return func(node) || (node[children] && node[children].length)
      })
  }
  return listFilter(tree)
}

/**
 * 提取树指定的参数
 * @param treeData 树
 * @param opt 参数
 * @returns
 */
export function treeMap<T = any>(treeData: T[], opt: { children?: string; conversion: Fn }): T[] {
  return treeData.map(item => treeMapEach(item, opt))
}

/**
 * 提取树指定的参数
 * @param data
 * @param param1
 * @returns
 */
export function treeMapEach(
  data: any,
  { children = 'children', conversion }: { children?: string; conversion: Fn },
) {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0
  const conversionData = conversion(data) || {}
  // 是否有子集 -- 递归
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((item: number) => treeMapEach(item, { children, conversion })),
    }
  } else {
    return {
      ...conversionData,
    }
  }
}

/**
 * 将数组转成tree
 * @param list 数组-树
 * @param config 对象
 * @returns
 */
export function listToTree<T = any>(list: any[], config: Partial<TreeHelperConfig> = {}): T[] {
  const conf = getConfig(config) as TreeHelperConfig
  const nodeMap = new Map()
  const result: T[] = []
  const { id, children, pid } = conf

  for (const node of list) {
    node[children] = node[children] || []
    nodeMap.set(node[id], node)
  }
  for (const node of list) {
    const parent = nodeMap.get(node[pid])
    ;(parent ? parent.children : result).push(node)
  }
  return result
}

/**
 * 将树转成数组
 * @param tree 树
 * @param config 树配置
 * @returns
 */
export function treeToList<T = any>(tree: any, config: Partial<TreeHelperConfig> = {}): T {
  config = getConfig(config)
  const { children } = config
  const result: any = [...tree]
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue
    result.splice(1 + i, 0, ...result[i][children!])
  }
  return result
}

/**
 * 获取匹配的第一个节点
 * @param tree 树（数组或对象）
 * @param func 函数条件
 * @param config 树属性
 * @returns
 */
export function findNode<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {},
): T | null {
  config = getConfig(config)
  const { children } = config
  const list = Array.isArray(tree) ? [...tree] : [tree]
  for (const node of list) {
    if (func(node)) return node
    node[children!] && list.push(...node[children!])
  }
  return null
}

/**
 * 获取匹配的所有节点
 * @param tree 树（数组或对象）
 * @param func 函数条件
 * @param config 树属性
 * @returns
 */
export function findNodeAll<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {},
): T[] {
  config = getConfig(config)
  const { children } = config
  const list = Array.isArray(tree) ? [...tree] : [tree]
  const result: T[] = []
  for (const node of list) {
    func(node) && result.push(node)
    node[children!] && list.push(...node[children!])
  }
  return result
}

/**
 * 获取第一个匹配的当前树节点路径
 * @param tree
 * @param func
 * @param config
 * @returns
 */
export function findPath<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {},
): T | T[] | null {
  config = getConfig(config)
  const path: T[] = []
  const list = Array.isArray(tree) ? [...tree] : [tree]
  const visitedSet = new Set()
  const { children } = config
  while (list.length) {
    const node = list[0]
    if (visitedSet.has(node)) {
      path.pop()
      list.shift()
    } else {
      visitedSet.add(node)
      node[children!] && list.unshift(...node[children!])
      path.push(node)
      if (func(node)) {
        return path
      }
    }
  }
  return null
}

/**
 * 获取所有匹配的当前树节点路径
 * @param tree
 * @param func
 * @param config
 * @returns
 */
export function findPathAll(tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}) {
  config = getConfig(config)
  const path: any[] = []
  const list = Array.isArray(tree) ? [...tree] : [tree]
  const result: any[] = []
  const visitedSet = new Set(),
    { children } = config
  while (list.length) {
    const node = list[0]
    if (visitedSet.has(node)) {
      path.pop()
      list.shift()
    } else {
      visitedSet.add(node)
      node[children!] && list.unshift(...node[children!])
      path.push(node)
      func(node) && result.push([...path])
    }
  }
  return result
}
