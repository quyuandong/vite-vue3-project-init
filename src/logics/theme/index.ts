import { mixDarken, mixLighten, tinycolor } from 'vite-plugin-theme/es/colorUtils'
import { replaceStyleVariables } from 'vite-plugin-theme/es/client'
import { generateColors, getThemeColors } from '../../../build/config/themeConfig'

/**
 * 改变主题
 * @param color 颜色
 * @returns
 */
export async function changeTheme(color: string) {
  const colors = generateColors({
    mixDarken,
    mixLighten,
    tinycolor,
    color,
  })

  return await replaceStyleVariables({
    colorVariables: [...getThemeColors(color), ...colors],
  })
}
