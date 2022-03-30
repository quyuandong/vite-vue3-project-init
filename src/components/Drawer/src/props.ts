import { PropType } from 'vue'

// 尾部传参
export const footerProps = {
  confirmLoading: { type: Boolean }, // 是否给确认按钮添加动画效果
  showCancelBtn: { type: Boolean, default: true }, // 是否显示取消按钮
  cancelButtonProps: Object as PropType<Recordable>, // 取消按钮传参
  cancelText: { type: String, default: '取消' }, // 取消按钮默认标题
  showOkBtn: { type: Boolean, default: true }, // 是否显示确认按钮
  okButtonProps: Object as PropType<Recordable>, // 确认按钮传参
  okText: { type: String, default: '确认' }, // 确认按钮标题
  okType: { type: String, default: 'primary' }, // 确认按钮标题
  showFooter: { type: Boolean }, //是否显示底部
  footerHeight: {
    // 底部高度
    type: [String, Number] as PropType<string | number>,
    default: 60,
  },
}

// 基础抽屉传递参数
export const basicProps = {
  isDetail: { type: Boolean },
  title: { type: String, default: '' }, // 标题
  loadingText: { type: String }, //加载内容
  showDetailBack: { type: Boolean, default: true },
  visible: { type: Boolean },
  loading: { type: Boolean }, // 加载动画
  maskClosable: { type: Boolean, default: true },
  getContainer: { type: [Object, String] as PropType<any> },
  closeFunc: { type: [Function, Object] as PropType<any> },
  destroyOnClose: { type: Boolean },
  ...footerProps,
}
