import { useThrottleFn } from '@vueuse/core'
import { computed, ref, Ref, unref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { MenuSplitTyeEnum } from '/@/enums/menuEnum'
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
import { useAppInject } from '/@/hooks/web/useAppInject'
import { getChildrenMenus, getCurrentParentPath, getMenus, getShallowMenus } from '/@/router/menus'
import { Menu } from '/@/router/types'
import { usePermissionStore } from '/@/store/modules/permission'

/**
 * 分割菜单
 * @param splitType 分割类型
 */
export function useSplitMenu(splitType: Ref<MenuSplitTyeEnum>) {
  const menusRef = ref<Menu[]>([])
  const { currentRoute } = useRouter()
  const { getIsMobile } = useAppInject()
  const permissionStore = usePermissionStore()

  const { setMenuSetting, getIsHorizontal, getSplit } = useMenuSetting()

  // 节流
  const throttleHandleSplitLeftMenu = useThrottleFn(handleSplitLeftMenu, 50)

  // 不是水平也不分割
  const splitNotLeft = computed(
    () => unref(splitType) !== MenuSplitTyeEnum.LEFT && !unref(getIsHorizontal),
  )
  // 是否左侧分割 true  不分割
  const getSplitLeft = computed(
    () => !unref(getSplit) || unref(splitType) !== MenuSplitTyeEnum.LEFT,
  )

  // 是否顶部分割
  const getSplitTop = computed(() => unref(splitType) === MenuSplitTyeEnum.TOP)

  // 不需要分割
  const normalType = computed(() => {
    return unref(splitType) === MenuSplitTyeEnum.NONE || !unref(getSplit)
  })

  // 监控当前路由路径 与 分割类型
  watch(
    [() => unref(currentRoute).path, () => unref(splitType)],
    async ([path]: [string, MenuSplitTyeEnum]) => {
      if (unref(splitNotLeft) || unref(getIsMobile)) return

      const { meta } = unref(currentRoute)
      const currentActiveMenu = meta.currentActiveMenu as string
      let parentPath = await getCurrentParentPath(path)
      if (!parentPath) {
        parentPath = await getCurrentParentPath(currentActiveMenu)
      }
      parentPath && throttleHandleSplitLeftMenu(parentPath)
    },
    {
      immediate: true,
    },
  )

  // 监控菜单改变
  watch(
    [() => permissionStore.getLastBuildMenuTime, () => permissionStore.getBackMenuList],
    () => {
      genMenus()
    },
    {
      immediate: true,
    },
  )

  // 分割类型变化
  watch(
    () => getSplit.value,
    () => {
      if (unref(splitNotLeft)) return
      genMenus()
    },
  )

  /**
   * 处理左菜单分割
   * @param parentPath 父节点路径
   */
  async function handleSplitLeftMenu(parentPath: string) {
    // 手机模式 或 左侧不分割
    if (unref(getSplitLeft) || unref(getIsMobile)) return

    // 获取左侧分割的菜单
    const children = await getChildrenMenus(parentPath)

    if (!children || !children.length) {
      setMenuSetting({ hidden: true })
      menusRef.value = []
      return
    }

    setMenuSetting({ hidden: false })
    menusRef.value = children
  }

  // 顶部分割与不分割
  async function genMenus() {
    // 不需要分割
    if (unref(normalType) || unref(getIsMobile)) {
      menusRef.value = await getMenus()
      return
    }
    // 顶部分割
    if (unref(getSplitTop)) {
      // 获得一级菜单，删除子菜单
      const shallowMenus = await getShallowMenus()
      menusRef.value = shallowMenus
      return
    }
  }

  return { menusRef }
}
