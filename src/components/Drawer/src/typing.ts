import { ScrollContainerOptions } from '/@/components/Container/src/typing'
import { ButtonProps } from '/@/components/Button'
import { ComputedRef, CSSProperties, VNodeChild } from 'vue'

// 抽屉实例-声明
export interface DrawerInstance {
  setDrawerProps: (props: Partial<DrawerProps> | boolean) => void //设置抽屉参数
  emitVisible?: (visible: boolean, uid: number) => void // 触发显示
}

// 暴露出的方法
export interface ReturnMethods extends DrawerInstance {
  openDrawer: <T = any>(visible?: boolean, data?: T, openOnSet?: boolean) => void
  closeDrawer: () => void
  getVisible?: ComputedRef<Boolean>
}

// 注册一个【抽屉】
export type RegisterFn = (drawerInstance: DrawerInstance, uuid?: string) => void

// 内联抽屉暴露方法
export interface ReturnInnerMethods extends DrawerInstance {
  closeDrawer: () => void
  changeLoading: (loading: boolean) => void
  changeOkLoading: (loading: boolean) => void
  getVisible?: ComputedRef<boolean>
}

// 抽屉返回类型
export type UseDrawerReturnType = [RegisterFn, ReturnMethods]

// 内联抽屉返回类型
export type UseDrawerInnerReturnType = [RegisterFn, ReturnInnerMethods]

// 抽屉底部传参
export interface DrawerFooterProps {
  showOkBtn: boolean // 是否显示确认按钮
  showCancelBtn: boolean // 是否显示取消按钮
  cancelText: string // 取消按钮的文本
  okText: string // 确认按钮的文本
  okType: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default' // 确认按钮类型
  okButtonProps: { props: ButtonProps; on: {} } // 确认按钮传参
  cancelButtonProps: { props: ButtonProps; on: {} } // 取消按钮传参
  confirmLoading: boolean // 确认按钮加载动画

  showFooter: boolean // 是否显示底部
  footerHeight: string | number // 底部高度
}

// 抽屉传参
export interface DrawerProps extends DrawerFooterProps {
  isDetail?: boolean // 是否详情
  loading?: boolean // 加载中
  showDetailBack?: boolean // 是否显示详情返回按钮
  visible?: boolean // 是否可见
  scrollOptions?: ScrollContainerOptions //内置ScrollContainer组件配置
  closeFunc?: () => Promise<any> // 关闭后回调
  triggerWindowResize?: boolean // 是否监控浏览器窗口变化
  closable?: boolean //【抽屉】右上角是否显示关闭按钮。
  destroyOnClose?: boolean // 是否在关闭【抽屉】之后进行销毁
  getContainer?: () => HTMLElement | string // 【抽屉】的挂载节点
  mask?: boolean // 是否显示蒙板
  maskClosable?: boolean // 点击蒙板是否可关闭
  maskStyle?: CSSProperties // 蒙板样式
  title?: VNodeChild | JSX.Element // 【抽屉】标题
  wrapClassName?: string // 对话框容器类名
  wrapStyle?: CSSProperties // 容器样式
  drawerStyle?: CSSProperties // 【抽屉】样式
  bodyStyle?: CSSProperties //浮动层的样式，通常用于调整其位置。
  headerStyle?: CSSProperties // 头部样式
  width?: string | number // 【抽屉】宽度
  height?: string | number // 【抽屉】高度
  zIndex?: number // 【抽屉】层级
  placement?: 'top' | 'right' | 'bottom' | 'left' // 【抽屉】的方向
  afterVisibleChange?: (visible?: boolean) => void // 切换抽屉时动画结束后的回调
  keyboard?: boolean // 是否支持键盘 esc 关闭
  onClose?: (e?: Event) => void // 关闭
}
