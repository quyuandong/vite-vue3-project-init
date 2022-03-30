import { ButtonProps } from 'ant-design-vue'
import { CSSProperties } from 'vue'
import { ModalWrapperProps } from './typing'

export const modalProps = {
  visible: { type: Boolean }, // 是否显示
  scrollTop: { type: Boolean, default: true }, //是否回到顶部
  height: { type: Number }, // 高度
  minHeight: { type: Number }, // 最小高度
  draggable: { type: Boolean, default: true }, // 是否可拖动
  centered: { type: Boolean }, // 是否居中
  cancelText: { type: String, default: '取消' },
  okText: { type: String, default: '确认' }, //

  closeFunc: Function as PropType<() => Promise<boolean>>,
}

export const basicProps = Object.assign({}, modalProps, {
  defaultFullscreen: { type: Boolean }, // 是否默认全屏
  canFullscreen: { type: Boolean, default: true }, // 是否可以全屏
  wrapperFooterOffset: { type: Number, default: 0 }, // 包裹一层，增加底部高度
  helpMessage: [String, Array] as PropType<string | string[]>, // 温馨提示信息
  useWrapper: { type: Boolean, default: true }, // 是否设置包裹
  loading: { type: Boolean }, // 加载动画
  loadingTip: { type: String }, // 加载提示语
  showCancelBtn: { type: Boolean, default: true }, // 取消按钮
  showOkBtn: { type: Boolean, default: true }, // 确认按钮
  wrapperProps: Object as PropType<Partial<ModalWrapperProps>>, // 包裹传参
  afterClose: Function as PropType<() => Promise<VueNode>>, // 关闭之后操作方法
  bodyStyle: Object as PropType<CSSProperties>, // 主体样式
  closable: { type: Boolean, default: true }, // 是否可关闭 x
  closeIcon: Object as PropType<VueNode>, // 关闭图标
  confirmLoading: { type: Boolean }, // 是否为OK按钮应用加载视觉效果
  destroyOnClose: { type: Boolean }, //是否在onClose上卸载子组件
  footer: Object as PropType<VueNode>, // 弹框页脚内容
  getContainer: Function as PropType<() => any>, // 返回Modal的挂载节点
  mask: { type: Boolean, default: true }, // 是否显示蒙板层
  maskClosable: { type: Boolean, default: true }, // 当蒙版(模态之外的区域)被点击时，是否关闭模态对话框
  keyboard: { type: Boolean, default: true }, // 蒙板样式
  maskStyle: Object as PropType<CSSProperties>, // 确认按钮文字
  okType: { type: String, default: 'primary' }, //确认按钮类型
  okButtonProps: Object as PropType<ButtonProps>, // 确认按钮传参
  cancelButtonProps: Object as PropType<ButtonProps>, // 取消男传参
  title: { type: String }, // 弹窗标题
  visible: { type: Boolean },
  width: [String, Number] as PropType<string | number>, // 弹窗宽度
  wrapClassName: { type: String }, // 弹框容器类名
  zIndex: { type: Number }, // 弹框层级
})
