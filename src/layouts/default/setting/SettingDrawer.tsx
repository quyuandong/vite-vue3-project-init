import { computed, defineComponent, unref } from 'vue'
import { BasicDrawer } from '/@/components/Drawer'
import { Divider } from 'ant-design-vue'
import { useRootSetting } from '/@/hooks/setting/useRootSetting'
import { AppDarkModeToggle } from '/@/components/Application'
import {
  InputNumberItem,
  SelectItem,
  SettingFooter,
  SwitchItem,
  ThemeColorPicker,
  TypePicker,
} from './components'
import {
  contentModeOptions,
  getMenuTriggerOptions,
  HandlerEnum,
  menuTypeList,
  mixSidebarTriggerOptions,
  routerTransitionOptions,
  tabsThemeOptions,
  topMenuAlignOptions,
} from './enum'
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
import { baseHandler } from './handler'
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting'
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting'

import {
  HEADER_PRESET_BG_COLOR_LIST,
  SIDE_BAR_BG_COLOR_LIST,
  APP_PRESET_COLOR_LIST,
} from '/@/settings/designSetting'
import { MenuTypeEnum, TriggerEnum } from '/@/enums/menuEnum'

export default defineComponent({
  name: 'SettingDrawer',

  setup(_, { attrs }) {
    // 系统配置
    const {
      getShowDarkModeToggle,
      getContentMode,
      getShowFooter,
      getShowBreadCrumb,
      getShowBreadCrumbIcon,
      getShowLogo,
      getFullContent,
      getColorWeak,
      getGrayMode,
      getLockTime,
      getThemeColor,
    } = useRootSetting()
    // 菜单配置
    const {
      getMenuType,
      getIsHorizontal,
      getShowMenu,
      getTrigger,
      getCollapsedShowTitle,
      getMenuFixed,
      getCollapsed,
      getCanDrag,
      getTopMenuAlign,
      getAccordion,
      getMenuWidth,
      getMenuBgColor,
      getIsTopMenu,
      getSplit,
      getIsMixSidebar,
      getCloseMixSidebarOnChange,
      getMixSideTrigger,
      getMixSideFixed,
    } = useMenuSetting()
    // 动画设置
    const { getOpenPageLoading, getBasicTransition, getEnableTransition, getOpenNProgress } =
      useTransitionSetting()
    //头部配置
    const {
      getShowHeader,
      getFixed: getHeaderFixed,
      getHeaderBgColor,
      getShowSearch,
    } = useHeaderSetting()
    // 页签配置
    const { getShowMultipleTab, getShowQuick, getShowRedo, getShowFold, getTabsTheme } =
      useMultipleTabSetting()

    const getShowMenuRef = computed(() => {
      return unref(getShowMenu) && !unref(getIsHorizontal)
    })

    // 导航栏模式-菜单
    function renderSidebar() {
      return (
        <>
          <TypePicker
            menuTypeList={menuTypeList}
            handler={(item: typeof menuTypeList[0]) => {
              baseHandler(HandlerEnum.CHANGE_LAYOUT, {
                mode: item.mode,
                type: item.type,
                split: unref(getIsHorizontal) ? false : undefined, //是否拆分菜单
              })
            }}
            def={unref(getMenuType)}
          />
        </>
      )
    }

    // 系统主题
    function renderMainTheme() {
      return (
        <ThemeColorPicker
          colorList={APP_PRESET_COLOR_LIST}
          def={unref(getThemeColor)}
          event={HandlerEnum.CHANGE_THEME_COLOR}
        ></ThemeColorPicker>
      )
    }

    // 头部主题
    function renderHeaderTheme() {
      return (
        <ThemeColorPicker
          colorList={HEADER_PRESET_BG_COLOR_LIST}
          def={unref(getHeaderBgColor)}
          event={HandlerEnum.HEADER_THEME}
        />
      )
    }

    // 侧边主题
    function renderSiderTheme() {
      return (
        <ThemeColorPicker
          colorList={SIDE_BAR_BG_COLOR_LIST}
          def={unref(getMenuBgColor)}
          event={HandlerEnum.MENU_THEME}
        />
      )
    }

    // 界面功能
    function renderFeatures() {
      let triggerDef = unref(getTrigger)

      const triggerOptions = getMenuTriggerOptions(unref(getSplit))
      const some = triggerOptions.some(item => item.value === triggerDef)
      if (!some) {
        triggerDef = TriggerEnum.FOOTER
      }

      return (
        <>
          <SwitchItem
            title="分割菜单"
            event={HandlerEnum.MENU_SPLIT}
            def={unref(getSplit)}
            disabled={!unref(getShowMenuRef) || unref(getMenuType) !== MenuTypeEnum.MIX}
          />
          <SwitchItem
            title="固定展开菜单"
            event={HandlerEnum.MENU_FIXED_MIX_SIDEBAR}
            def={unref(getMixSideFixed)}
            disabled={!unref(getIsMixSidebar)}
          />

          <SwitchItem
            title="切换页面关闭菜单"
            event={HandlerEnum.MENU_CLOSE_MIX_SIDEBAR_ON_CHANGE}
            def={unref(getCloseMixSidebarOnChange)}
            disabled={!unref(getIsMixSidebar)}
          />
          <SwitchItem
            title="折叠菜单"
            event={HandlerEnum.MENU_COLLAPSED}
            def={unref(getCollapsed)}
            disabled={!unref(getShowMenuRef)}
          />

          <SwitchItem
            title="侧边菜单拖拽"
            event={HandlerEnum.MENU_HAS_DRAG}
            def={unref(getCanDrag)}
            disabled={!unref(getShowMenuRef)}
          />
          <SwitchItem
            title="菜单搜索"
            event={HandlerEnum.HEADER_SEARCH}
            def={unref(getShowSearch)}
            disabled={!unref(getShowHeader)}
          />
          <SwitchItem
            title="侧边菜单手风琴模式"
            event={HandlerEnum.MENU_ACCORDION}
            def={unref(getAccordion)}
            disabled={!unref(getShowMenuRef)}
          />

          <SwitchItem
            title="折叠菜单显示名称"
            event={HandlerEnum.MENU_COLLAPSED_SHOW_TITLE}
            def={unref(getCollapsedShowTitle)}
            disabled={!unref(getShowMenuRef) || !unref(getCollapsed) || unref(getIsMixSidebar)}
          />

          <SwitchItem
            title="固定header"
            event={HandlerEnum.HEADER_FIXED}
            def={unref(getHeaderFixed)}
            disabled={!unref(getShowHeader)}
          />
          <SwitchItem
            title="固定Sidebar"
            event={HandlerEnum.MENU_FIXED}
            def={unref(getMenuFixed)}
            disabled={!unref(getShowMenuRef) || unref(getIsMixSidebar)}
          />
          <SelectItem
            title="混合菜单触发方式"
            event={HandlerEnum.MENU_TRIGGER_MIX_SIDEBAR}
            def={unref(getMixSideTrigger)}
            options={mixSidebarTriggerOptions}
            disabled={!unref(getIsMixSidebar)}
          />
          <SelectItem
            title="顶部菜单布局"
            event={HandlerEnum.MENU_TOP_ALIGN}
            def={unref(getTopMenuAlign)}
            options={topMenuAlignOptions}
            disabled={
              !unref(getShowHeader) ||
              unref(getSplit) ||
              (!unref(getIsTopMenu) && !unref(getSplit)) ||
              unref(getIsMixSidebar)
            }
          />
          <SelectItem
            title="菜单折叠按钮"
            event={HandlerEnum.MENU_TRIGGER}
            def={triggerDef}
            options={triggerOptions}
            disabled={!unref(getShowMenuRef) || unref(getIsMixSidebar)}
          />
          <SelectItem
            title="内容区域宽度"
            event={HandlerEnum.CONTENT_MODE}
            def={unref(getContentMode)}
            options={contentModeOptions}
          />
          <InputNumberItem
            title="自动锁屏"
            min={0}
            event={HandlerEnum.LOCK_TIME}
            defaultValue={unref(getLockTime)}
            formatter={(value: string) => {
              return parseInt(value) === 0 ? `0(不自动锁屏)` : `${value}分钟`
            }}
          />
          <InputNumberItem
            title="菜单展开宽度"
            max={600}
            min={100}
            step={10}
            event={HandlerEnum.MENU_WIDTH}
            disabled={!unref(getShowMenuRef)}
            defaultValue={unref(getMenuWidth)}
            formatter={(value: string) => `${parseInt(value)}px`}
          />
        </>
      )
    }

    // 界面显示
    function renderContent() {
      return (
        <>
          <SwitchItem
            title="面包屑"
            event={HandlerEnum.SHOW_BREADCRUMB}
            def={unref(getShowBreadCrumb)}
            disabled={!unref(getShowHeader)}
          />

          <SwitchItem
            title="面包屑图标"
            event={HandlerEnum.SHOW_BREADCRUMB_ICON}
            def={unref(getShowBreadCrumbIcon)}
            disabled={!unref(getShowHeader)}
          />

          <SwitchItem
            title="标签页"
            event={HandlerEnum.TABS_SHOW}
            def={unref(getShowMultipleTab)}
          />

          <SwitchItem
            title="标签页刷新按钮"
            event={HandlerEnum.TABS_SHOW_REDO}
            def={unref(getShowRedo)}
            disabled={!unref(getShowMultipleTab)}
          />

          <SwitchItem
            title="标签页快捷按钮"
            event={HandlerEnum.TABS_SHOW_QUICK}
            def={unref(getShowQuick)}
            disabled={!unref(getShowMultipleTab)}
          />
          <SwitchItem
            title="标签页折叠按钮"
            event={HandlerEnum.TABS_SHOW_FOLD}
            def={unref(getShowFold)}
            disabled={!unref(getShowMultipleTab)}
          />
          <SelectItem
            title="标签页样式"
            event={HandlerEnum.TABS_THEME}
            def={unref(getTabsTheme)}
            options={tabsThemeOptions}
          />

          <SwitchItem
            title="左侧菜单"
            event={HandlerEnum.MENU_SHOW_SIDEBAR}
            def={unref(getShowMenu)}
            disabled={unref(getIsHorizontal)}
          />

          <SwitchItem title="顶栏" event={HandlerEnum.HEADER_SHOW} def={unref(getShowHeader)} />
          <SwitchItem
            title="Logo"
            event={HandlerEnum.SHOW_LOGO}
            def={unref(getShowLogo)}
            disabled={unref(getIsMixSidebar)}
          />
          <SwitchItem title="页脚" event={HandlerEnum.SHOW_FOOTER} def={unref(getShowFooter)} />
          <SwitchItem
            title="全屏内容"
            event={HandlerEnum.FULL_CONTENT}
            def={unref(getFullContent)}
          />

          <SwitchItem title="灰色模式" event={HandlerEnum.GRAY_MODE} def={unref(getGrayMode)} />

          <SwitchItem title="色弱模式" event={HandlerEnum.COLOR_WEAK} def={unref(getColorWeak)} />
        </>
      )
    }

    // 动画
    function renderTransition() {
      return (
        <>
          <SwitchItem
            title="顶部进度条"
            event={HandlerEnum.OPEN_PROGRESS}
            def={unref(getOpenNProgress)}
          />
          <SwitchItem
            title="切换loading"
            event={HandlerEnum.OPEN_PAGE_LOADING}
            def={unref(getOpenPageLoading)}
          />

          <SwitchItem
            title="切换动画"
            event={HandlerEnum.OPEN_ROUTE_TRANSITION}
            def={unref(getEnableTransition)}
          />

          <SelectItem
            title="动画类型"
            event={HandlerEnum.ROUTER_TRANSITION}
            def={unref(getBasicTransition)}
            options={routerTransitionOptions}
            disabled={!unref(getEnableTransition)}
          />
        </>
      )
    }

    return () => (
      <BasicDrawer {...attrs} title="项目配置" width={330} wrapClassName="setting-drawer">
        {/* 主题 */}
        {unref(getShowDarkModeToggle) && <Divider>{() => '主题'}</Divider>}
        {unref(getShowDarkModeToggle) && <AppDarkModeToggle class="mx-auto" />}

        {/* 导航栏模式 */}
        <Divider>{() => '导航栏模式'}</Divider>
        {renderSidebar()}

        {/* 系统主题 */}
        <Divider>{() => '系统主题'}</Divider>
        {renderMainTheme()}

        {/* 顶部主题 */}
        <Divider>{() => '顶部主题'}</Divider>
        {renderHeaderTheme()}

        {/* 菜单主题 */}
        <Divider>{() => '菜单主题'}</Divider>
        {renderSiderTheme()}

        {/* 界面功能 */}
        <Divider>{() => '界面功能'}</Divider>
        {renderFeatures()}

        {/* 界面显示 */}
        <Divider>{() => '界面显示'}</Divider>
        {renderContent()}

        {/* 动画 */}
        <Divider>{() => '动画'}</Divider>
        {renderTransition()}
        <Divider />
        <SettingFooter />
      </BasicDrawer>
    )
  },
})
