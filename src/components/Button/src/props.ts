import { PropType } from 'vue'

export const buttonProps = {
  // 颜色
  color: { type: String, validator: v => ['error', 'warning', 'success', ''].includes(v) },
  // 加载中
  loading: { type: Boolean },
  // 是否可用
  disabled: { type: Boolean },
  // 前缀图标
  preIcon: { type: String },
  // 后缀图标
  postIcon: { type: String },
  // 图标大小
  iconSize: { type: Number, default: 14 },
  // 点击时间
  onClick: { type: Function as PropType<(...args) => any>, default: null },
}
