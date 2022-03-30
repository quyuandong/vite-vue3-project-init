import { useAppProviderContext } from '/@/components/Application'
/**
 * 返回修改后的类名
 * @param scope 样式类名
 * @returns 添加统一前缀的样式类名
 */
export function useDesign(scope: string) {
  const values = useAppProviderContext()
  return {
    prefixCls: `${values.prefixCls}-${scope}`,
    prefixVar: values.prefixCls,
  }
}
