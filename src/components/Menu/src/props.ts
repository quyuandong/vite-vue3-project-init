import { MenuMode } from 'ant-design-vue/lib/menu/src/interface'
import { PropType } from 'vue'
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum'
import { Menu } from '/@/router/types'
import { propTypes } from '/@/utils/propTypes'
import type { MenuTheme } from 'ant-design-vue'
import { ThemeEnum } from '/@/enums/appEnum'

export const basicProps = {
  items: {
    //菜单列表
    type: Array as PropType<Menu[]>,
    default: () => [],
  },
  collapsedShowTitle: propTypes.bool, // 折叠是否显示标题
  mode: {
    // 菜单模式（水平、竖直，内联）
    type: String as PropType<MenuMode>,
    default: MenuModeEnum.INLINE,
  },
  type: {
    // 菜单类型（左侧、顶部、混合）
    type: String as PropType<MenuTypeEnum>,
    default: MenuTypeEnum.MIX,
  },
  theme: {
    // 菜单主题
    type: String as PropType<MenuTheme>,
    default: ThemeEnum.DARK,
  },
  inlineCollapsed: propTypes.bool, //内联 时菜单是否收起状态
  mixSider: propTypes.bool,

  isHorizontal: propTypes.bool, //是否是水平
  accordion: propTypes.bool.def(true), // 是否像手风琴一样
  beforeClickFn: {
    // 点击之前的方法
    type: Function as PropType<(key: string) => Promise<boolean>>,
  },
}

export const itemProps = {
  item: {
    type: Object as PropType<Menu>,
    default: {},
  },
  level: propTypes.number, // 层级
  theme: propTypes.oneOf(['dark', 'light']), // 主题
  showTitle: propTypes.bool, // 是否显示标题
  isHorizontal: propTypes.bool, // 是否水平
}

export const contentProps = {
  item: {
    type: Object as PropType<Menu>,
    default: {},
  },
  showTitle: propTypes.bool.def(true),
  level: propTypes.number.def(0),
  isHorizontal: propTypes.bool.def(true),
}
