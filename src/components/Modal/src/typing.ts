import { ButtonProps } from 'ant-design-vue'
import { Omit } from 'lodash'
import { ComputedRef, CSSProperties, VNodeChild } from 'vue'

// 弹窗对外暴露的方法
export interface ModalMethods {
  setModalProps: (props: Partial<ModalProps>) => void //设置模态框的传参
  emitVisible?: (visible: boolean, uid: number) => void // 是否显示模态框
  redoModalHeight?: () => void // 重设modal的高度
}

// 对外暴露的弹窗注册方法
export type RegisterFn = (modalMethods: ModalMethods, uuid?: string) => void

// 追加对外暴露的方法
export interface ReturnMethods extends ModalMethods {
  openModal: <T = any>(props?: boolean, data?: T, openOnSet?: boolean) => any // 打开弹窗
  closeModal: () => void // 关闭弹窗
  getVisible?: ComputedRef<boolean> // 是否显示
}
// 使用弹框时返回值类型
export type useModalReturnType = [RegisterFn, ReturnMethods]

// 内部返回值类型
export interface ReturnInnerMethods extends ModalMethods {
  closeModal: () => void
  changeLoading: (loading: boolean) => void
  changeOkLoading: (loading: boolean) => void
  getVisible?: ComputedRef<boolean>
  redoModalHeight: () => void
}
// 使用弹框时返回值类型
export type UseModalInnerReturnType = [RegisterFn, ReturnInnerMethods]

export interface ModalProps {
  minHeight?: boolean // 最小高度
  height?: number // 高度
  wrapperFooterOffset?: number // 底部偏移（启用wrapper后 底部可适当增加高度）
  draggable?: boolean // 是否可以拖动
  scrollTop?: boolean // 是否可回到顶部
  canFullscreen?: boolean // 是否全屏
  defaultFullscreen?: boolean // 是否默认全屏
  visible?: boolean // 是否可显示
  helpMessage: string | string[] // 温馨提示
  useWrapper: boolean // 是否使用modalWrapper
  loading?: boolean // 加载动画
  loadingTip?: string // 加载提示语
  wrapperProps: Omit<ModalWrapperProps, 'loading'> // wrapper 的参数
  showOkBtn: boolean // 是否显示确认按钮
  showCancelBtn: boolean // 是否显示取消按钮
  afterClose?: () => any // 指定一个将在modal完全关闭时调用的函数。
  bodyStyle?: CSSProperties // 模态体元素的体样式。 例如高度，填充等等。
  cancelText?: string // 取消按钮文字
  centered?: boolean // 弹框是否居中
  closeable?: boolean // 关闭(x)按钮是否在模态对话框的右上角可见
  closeIcon?: VNodeChild | JSX.Element // 关闭图标
  confirmLoading?: boolean // 是否为OK按钮应用加载视觉效果
  destroyOnClose?: boolean //是否在onClose上卸载子组件
  footer?: VNodeChild | JSX.Element // 弹框页脚内容
  getContainer?: (instance: any) => HTMLElement // 返回Modal的挂载节点
  mask?: boolean // 是否显示蒙板层
  maskClosable?: boolean // 当蒙版(模态之外的区域)被点击时，是否关闭模态对话框
  maskStyle?: CSSProperties // 蒙板样式
  okText?: string // 确认按钮文字
  okType?: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default' //确认按钮类型
  okButtonProps?: ButtonProps // 确认按钮传参
  cancelButtonProps?: ButtonProps // 取消男传参
  title?: VNodeChild | JSX.Element // 弹窗标题
  width?: string | number // 弹窗宽度
  wrapClassName?: string // 弹框容器类名
  zIndex?: number // 弹框层级
}

export interface ModalWrapperProps {
  footerOffset?: number // 底部偏移
  loading: boolean // 动画
  modalHeaderHeight: number // 弹框头部高度
  modalFooterHeight: number // 弹框底部高度
  minHeight: number // 最小高度
  height: number // 高度
  visible: boolean // 是否可见
  fullScreen: boolean // 是否全屏
  useWrapper: boolean // 是否滚动
}
