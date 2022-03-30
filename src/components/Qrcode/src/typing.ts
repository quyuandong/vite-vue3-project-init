import type { QRCodeSegment, QRCodeRenderersOptions } from 'qrcode'

export type ContentType = string | QRCodeSegment[]

// 二维码中logo参数
export type LogoType = {
  src: string
  logoSize: number
  borderColor: string
  bgColor: string
  borderSize: number
  crossOrigin: string
  borderRadius: number
  logoRadius: number
}

//  渲染二维码参数
export interface RenderQrCodeParams {
  canvas: any
  content: ContentType
  width?: number
  options?: QRCodeRenderersOptions
  logo?: LogoType | string
  image?: HTMLImageElement
  downLoadName?: string
  download?: boolean | Fn
}

export interface QrcodeDoneEventParams {
  url: string
  ctx?: CanvasRenderingContext2D | null
}

export interface QrCodeActionType {
  download: (fileName?: string) => void
}
