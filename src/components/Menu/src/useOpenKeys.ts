import { computed } from 'vue'
/**
 * 打开对应的菜单项
 */

import { indexOf, uniq } from 'lodash-es'
import { Ref, toRaw, unref } from 'vue'
import { MenuState } from './typing'
import { MenuModeEnum } from '/@/enums/menuEnum'
import { useTimeoutFn } from '/@/hooks/core/useTimeout'
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
import { getAllParentPath } from '/@/router/helper/menuHelper'
import type { Menu as MenuType } from '/@/router/types'

export function useOpenKeys(
  menuState: MenuState,
  menus: Ref<MenuType[]>,
  mode: Ref<MenuModeEnum>,
  accordion: Ref<boolean>,
) {
  const { getCollapsed, getIsMixSidebar } = useMenuSetting()

  // 设置要打开的菜单
  async function setOpenKeys(path: string) {
    // 水平菜单不需要进行展开
    if (mode.value === MenuModeEnum.HORIZONTAL) {
      return
    }
    const native = unref(getIsMixSidebar)
    useTimeoutFn(
      () => {
        const menuList = toRaw(menus.value)
        if (menuList?.length === 0) {
          menuState.openKeys = []
          return
        }
        if (!unref(accordion)) {
          menuState.openKeys = uniq([...menuState.openKeys, ...getAllParentPath(menuList, path)])
        } else {
          menuState.openKeys = getAllParentPath(menuList, path)
        }
      },
      16,
      !native,
    )
  }

  // 获取折叠的菜单或者是展开的
  const getOpenKeys = computed(() => {
    const collapse = unref(getIsMixSidebar) ? false : unref(getCollapsed)
    return collapse ? menuState.collapsedOpenKeys : menuState.openKeys
  })

  // 重置值
  function resetKeys() {
    menuState.selectedKeys = []
    menuState.openKeys = []
  }

  function handleOpenChange(openKeys: string[]) {
    if (unref(mode) === MenuModeEnum.HORIZONTAL || !unref(accordion) || unref(getIsMixSidebar)) {
      menuState.openKeys = openKeys
    } else {
      const rootSubMenuKeys: string[] = []
      for (const { children, path } of unref(menus)) {
        if (children && children.length > 0) {
          rootSubMenuKeys.push(path)
        }
      }
      if (!unref(getCollapsed)) {
        // 是否是最新打开的key
        const latestOpenKey = openKeys.find(key => menuState.openKeys.indexOf(key) === -1)
        if (rootSubMenuKeys.indexOf(latestOpenKey as string) === -1) {
          menuState.openKeys = openKeys
        } else {
          menuState.openKeys = latestOpenKey ? [latestOpenKey] : []
        }
      } else {
        menuState.collapsedOpenKeys = openKeys
      }
    }
  }
  return { setOpenKeys, resetKeys, getOpenKeys, handleOpenChange }
}
