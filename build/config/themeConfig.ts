/**
 * 项目主题相关的配置
 */

import { generate } from '@ant-design/colors'

type Fn = (...arg: any) => any
type GenerateTheme = 'default' | 'dark'

// 项目主题色
export const primaryColor = '#0960bd'
// 主题模式
export const darkMode = 'light'

export interface GenerateColorsParams {
  mixLighten: Fn // 最亮
  mixDarken: Fn // 最暗
  tinycolor: any //颜色范围
  color?: string
}

/**
 * 生成antDesign 颜色
 * @param color 颜色
 * @param theme 主题
 * @returns
 */
export function generateAntColors(color: string, theme: GenerateTheme = 'default') {
  return generate(color, { theme })
}

/**
 * 获取主题颜色组
 * @param color 颜色
 * @returns
 */
export function getThemeColors(color?: string) {
  const themeColor = color || primaryColor
  const lightColors = generateAntColors(themeColor)
  const primary = lightColors[5]
  const modeColors = generateAntColors(primary, 'dark')
  return [...lightColors, ...modeColors]
}

export function generateColors({
  color = primaryColor,
  mixDarken,
  mixLighten,
  tinycolor,
}: GenerateColorsParams) {
  const arr = new Array(19).fill(0)
  const lightens = arr.map((_t, i) => {
    return mixLighten(color, i / 5)
  })
  const darkens = arr.map((_t, i) => {
    return mixDarken(color, i / 5)
  })
  const alphaColors = arr.map((_t, i) => {
    return tinycolor(color)
      .setAlpha(i / 20)
      .toRgbString()
  })
  const shortAlphaColors = alphaColors.map(item => item.replace(/\s/g, '').replace(/0\./g, ''))

  const tinycolorLightens = arr
    .map((_t, i) => {
      return tinycolor(color)
        .lighten(i * 5)
        .toHexString()
    })
    .filter(item => item != '#ffffff')

  const tinycolorDarkens = arr
    .map((_t, i) => {
      return tinycolor(color)
        .darken(i * 5)
        .toHexString()
    })
    .filter(item => item !== '#000000')

  return [
    ...lightens,
    ...darkens,
    ...alphaColors,
    ...shortAlphaColors,
    ...tinycolorLightens,
    ...tinycolorDarkens,
  ]
}
