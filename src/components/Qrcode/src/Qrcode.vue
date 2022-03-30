<template>
  <Tooltip placement="top" trigger="click" title="双击下载二维码">
    <div @dblclick="download('二维码')"><component :is="tag" ref="wrapRef" /></div>
  </Tooltip>
</template>
<script lang="ts">
  import { QRCodeRenderersOptions, toDataURL } from 'qrcode'
  import { defineComponent, onMounted, PropType, ref, unref, watch } from 'vue'
  import { toCanvas } from './toCanvas'
  import { LogoType, QrcodeDoneEventParams } from './typing'
  import { downloadByUrl } from '/@/utils/file/download'
  import { Tooltip } from 'ant-design-vue'

  export default defineComponent({
    name: 'QrCode',
    components: { Tooltip },
    props: {
      value: {
        type: [String, Array] as PropType<string | any[]>,
        default: null,
      },
      // 参数
      options: {
        type: Object as PropType<QRCodeRenderersOptions>,
        default: null,
      },
      // 宽度
      width: {
        type: Number as PropType<number>,
        default: 200,
      },
      // 中间logo图案
      logo: {
        type: [String, Object] as PropType<Partial<LogoType> | string>,
        default: '',
      },
      // img 不支持内嵌logo
      tag: {
        type: String as PropType<'canvas' | 'img'>,
        default: 'canvas',
        validator: (v: string) => ['canvas', 'img'].includes(v),
      },
    },
    emits: { done: (data: QrcodeDoneEventParams) => !!data, error: (error: any) => !!error },
    setup(props, { emit }) {
      const wrapRef = ref<HTMLCanvasElement | HTMLImageElement | null>(null)

      // 创建二维码
      async function createQrcode() {
        try {
          const { tag, value, options = {}, width, logo } = props
          const renderValue = String(value)
          const wrapEl = unref(wrapRef)
          if (!wrapEl) return
          if (tag === 'canvas') {
            const url: string = await toCanvas({
              canvas: wrapEl,
              width,
              logo: logo as any,
              content: renderValue,
              options: options || {},
            })
            emit('done', { url, ctx: (wrapEl as HTMLCanvasElement).getContext('2d') })
            return
          }
          if (tag === 'img') {
            const url = await toDataURL(renderValue, {
              errorCorrectionLevel: 'H',
              width,
              ...options,
            })
            ;(unref(wrapRef) as HTMLImageElement).src = url
            emit('done', { url })
          }
        } catch (error) {
          emit('error', error)
        }
      }

      // 二维码图片下载
      function download(fileName?: string) {
        let url = ''
        const wrapEl = unref(wrapRef)
        if (wrapEl instanceof HTMLCanvasElement) {
          url = wrapEl.toDataURL()
        } else if (wrapEl instanceof HTMLImageElement) {
          url = wrapEl.src
        }

        if (!url) return

        downloadByUrl({
          url,
          fileName,
        })
      }

      onMounted(createQrcode)

      // 监听参数变化重新生成二维码
      watch(
        props,
        () => {
          createQrcode()
        },
        {
          deep: true,
        },
      )

      return { wrapRef, download }
    },
  })
</script>
