<template>
  <SvgIcon
    :size="size"
    :name="getSvgIcon"
    v-if="isSvgIcon"
    :class="[$attrs.class, 'anticon']"
    :spin="spin"
  />
  <span
    v-else
    ref="elRef"
    :class="[$attrs.class, 'app-iconify anticon', spin && 'app-iconify-spin']"
    :style="getWrapStyle"
  ></span>
</template>
<script lang="ts">
  import {
    computed,
    CSSProperties,
    defineComponent,
    nextTick,
    onMounted,
    PropType,
    ref,
    unref,
    watch,
  } from 'vue'
  import SvgIcon from './SvgIcon.vue'
  import Iconify from '@purge-icons/generated'
  import { isString } from '/@/utils/is'
  import { propTypes } from '/@/utils/propTypes'
  const SVG_END_WITH_FLAG = '|svg'
  export default defineComponent({
    name: 'Icon',
    components: { SvgIcon },
    props: {
      icon: propTypes.string, //图标
      color: propTypes.string, // 颜色
      size: { type: [String, Number] as PropType<string | number>, default: 16 }, // 图标大小
      spin: propTypes.bool.def(false), // 是否有旋转动画
      prefix: propTypes.string.def(''), // 图标前缀
    },
    setup(props) {
      const elRef = ref<ElRef>(null)

      const isSvgIcon = computed(() => props.icon.endsWith(SVG_END_WITH_FLAG))
      const getSvgIcon = computed(() => props.icon.replace(SVG_END_WITH_FLAG, ''))
      const getIconRef = computed(() => `${props.prefix ? props.prefix + ':' : ''}${props.icon}`)

      const updateIcon = async () => {
        if (unref(isSvgIcon)) return

        const el = unref(elRef)
        if (!el) return

        await nextTick()
        const icon = unref(getIconRef)
        if (!icon) return

        const svg = Iconify.renderSVG(icon, {})
        if (svg) {
          el.textContent = ''
          el.appendChild(svg)
        } else {
          const span = document.createElement('span')
          span.className = 'iconify'
          span.dataset.icon = icon
          el.textContent = ''
          el.appendChild(span)
        }
      }

      // 获取图标样式
      const getWrapStyle = computed((): CSSProperties => {
        const { size, color } = props
        let fs = size
        if (isString(size)) {
          fs = parseInt(size, 10)
        }

        return {
          fontSize: `${fs}px`,
          color: color,
          display: 'inline-flex',
        }
      })

      // 监控icon的变化 post作用相当于$nextTick
      watch(() => props.icon, updateIcon, { flush: 'post' })

      onMounted(updateIcon)

      return { elRef, getWrapStyle, isSvgIcon, getSvgIcon }
    },
  })
</script>
<style lang="less">
  .app-iconify {
    display: inline-block;
    // vertical-align: middle;

    &-spin {
      svg {
        animation: loadingCircle 1s infinite linear;
      }
    }
  }

  span.iconify {
    display: block;
    min-width: 1em;
    min-height: 1em;
    background-color: @iconify-bg-color;
    border-radius: 100%;
  }
</style>
