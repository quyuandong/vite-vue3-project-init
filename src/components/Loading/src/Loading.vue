<template>
  <section
    class="full-loading"
    :class="{ absolute, [theme]: !!theme }"
    :style="[background ? `background-color: ${background}` : '']"
    v-show="loading"
  >
    <Spin v-bind="$attrs" :tip="tip" :size="size" :spinning="loading" />
  </section>
</template>
<script lang="ts">
  import { Spin } from 'ant-design-vue'
  import { defineComponent, PropType } from 'vue'
  import { SizeEnum } from '/@/enums/sizeEnum'

  export default defineComponent({
    name: 'Loading',
    components: { Spin },
    props: {
      tip: { type: String as PropType<string>, default: '' }, //加载描述文案
      size: {
        // 动画加载大小
        type: String as PropType<SizeEnum>,
        default: SizeEnum.LARGE,
        validator: (v: SizeEnum): boolean => {
          return [SizeEnum.DEFAULT, SizeEnum.SMALL, SizeEnum.LARGE].includes(v)
        },
      },
      absolute: { type: Boolean as PropType<boolean>, default: false }, // 定位
      loading: { type: Boolean as PropType<boolean>, default: false }, // 加载动画
      background: { type: String as PropType<string> }, // 背景颜色
      theme: { type: String as PropType<'dark' | 'light'>, default: 'light' }, // 主题
    },
  })
</script>
<style lang="less" scoped>
  .full-loading {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgb(240 242 245 / 40%);

    &.absolute {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 300;
    }
  }

  html[data-theme='dark'] {
    .full-loading:not(.light) {
      background-color: @modal-mask-bg;
    }
  }

  .full-loading.dark {
    background-color: @modal-mask-bg;
  }
</style>
