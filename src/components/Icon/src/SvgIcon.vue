<template>
  <svg
    :class="[prefixCls, $attrs.class, spin && 'svg-icon-spin']"
    :style="getStyle"
    aria-hidden="true"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>
<script lang="ts">
  import { computed, CSSProperties, defineComponent } from 'vue'
  import { useDesign } from '/@/hooks/web/useDesign'

  export default defineComponent({
    name: 'SvgIcon',
    props: {
      prefix: { type: String, default: 'icon' }, // 前缀
      name: { type: String, required: true }, // svg name
      size: { type: [Number, String], default: 16 }, // 大小
      spin: { type: Boolean, default: false }, //是否旋转动画
    },

    setup(props) {
      const { prefixCls } = useDesign('svg-icon')
      const symbolId = computed(() => `#${props.prefix}-${props.name}`)

      const getStyle = computed((): CSSProperties => {
        const { size } = props
        let s = `${size}`
        s = `${s.replace('px', '')}px`
        return {
          width: s,
          height: s,
        }
      })

      return {
        symbolId,
        prefixCls,
        getStyle,
      }
    },
  })
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-svg-icon';
  .@{prefix-cls}{
    display: inline-block;
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentColor;
  }

  .svg-icon-spin{
    animation: loadingCircle 1s infinite linear;
  }
</style>
