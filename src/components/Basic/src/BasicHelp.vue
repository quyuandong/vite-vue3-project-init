<script lang="tsx">
  import { InfoCircleOutlined } from '@ant-design/icons-vue'
  import { Tooltip } from 'ant-design-vue'
  import { computed, CSSProperties, defineComponent, PropType, unref } from 'vue'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { getPopupContainer } from '/@/utils'
  import { getSlot } from '/@/utils/helper/tsxHelper'
  import { isArray, isString } from '/@/utils/is'

  const props = {
    maxWidth: { type: String, default: '600px' }, // 帮助文本最大长度
    showIndex: { type: Boolean }, // 是否显示序列号
    color: { type: String, default: '#ffffff' }, // 文本颜色
    fontSize: { type: String, default: '14px' }, // 文本字体
    placement: { type: String, default: 'right' }, // 文字方向
    text: { type: [Array, String] as PropType<string | string[]> }, //文本列表
  }

  export default defineComponent({
    name: 'BasicHelp',
    components: { Tooltip },
    props,
    setup(props, { slots }) {
      const { prefixCls } = useDesign('basic-help')

      // 文字提示样式
      const getTooltipStyle = computed(
        (): CSSProperties => ({ color: props.color, fontSize: props.fontSize }),
      )

      // 获取卡片样式
      const getOverlayStyle = computed((): CSSProperties => ({ maxWidth: props.maxWidth }))

      // 渲染标题
      function renderTitle() {
        const textList = props.text
        if (isString(textList)) {
          return <p>{textList}</p>
        }
        if (isArray(textList)) {
          return textList.map((text, index) => {
            return (
              <p key="index">
                <>
                  {props.showIndex ? `${index + 1}.` : ``}
                  {text}
                </>
              </p>
            )
          })
        }
        return null
      }
      return () => {
        return (
          <Tooltip
            overlayClassName={`${prefixCls}__wrap`}
            title={<div style={unref(getTooltipStyle)}>{renderTitle()}</div>}
            autoAdjustOverflow={true}
            overlayStyle={unref(getOverlayStyle)}
            placement={props.placement as 'right'}
            getPopupContainer={() => getPopupContainer()}
          >
            <span class={prefixCls}>{getSlot(slots) || <InfoCircleOutlined />}</span>
          </Tooltip>
        )
      }
    },
  })
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-help';

  .@{prefix-cls} {
    display: inline-block;
    margin-left: 6px;
    font-size: 14px;
    color: @text-color-help-dark;
    cursor: pointer;

    &:hover {
      color: @primary-color;
    }

    &__wrap {
      p {
        margin-bottom: 0;
      }
    }
  }
</style>
