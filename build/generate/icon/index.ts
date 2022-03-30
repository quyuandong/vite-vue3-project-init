import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import chalk from 'chalk'
import pkg from '../../../package.json'

async function generateIcon() {
  const dir = path.resolve(process.cwd(), 'node_modules/@iconify/json')

  const raw = await fs.readJSON(path.join(dir, 'collections.json'))

  const collections = Object.entries(raw).map(([id, v]) => ({
    ...(v as any),
    id,
  }))

  const choices = collections.map(item => ({ key: item.id, value: item.id, name: item.name }))

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'useType',
        choices: [
          { key: 'local', value: 'local', name: '本地图标' },
          { key: 'onLine', value: 'onLine', name: '在线图标' },
        ],
        message: '如何使用图标？',
      },
      {
        type: 'list',
        name: 'iconSet',
        choices: choices,
        message: '选择需要生成的图标集?  ',
      },
      {
        type: 'input',
        name: 'output',
        message: '选择需要生成的图标集?  ',
        default: 'src/components/Icon/data',
      },
    ])
    .then(async answers => {
      const { iconSet, output, useType } = answers
      const outputDir = path.resolve(process.cwd(), output)
      fs.ensureDir(outputDir)
      const genCollections = collections.filter(item => [iconSet].includes(item.id))
      const prefixSet: string[] = []
      for (const info of genCollections) {
        const data = await fs.readJSON(path.join(dir, 'json', `${info.id}.json`))
        if (data) {
          const { prefix } = data
          const isLocal = useType === 'local'
          const icons = Object.keys(data.icons).map(item => `${isLocal ? prefix + ':' : ''}${item}`)

          await fs.writeFileSync(
            path.join(output, `icons.data.ts`),
            `export default ${isLocal ? JSON.stringify(icons) : JSON.stringify({ prefix, icons })}`,
          )
          prefixSet.push(prefix)
        }
      }
      fs.emptyDir(path.join(process.cwd(), 'node_modules/.vite'))
      console.log(
        `✨ ${chalk.cyan(`[${pkg.name}]`)}` + ' - Icon generated successfully:' + `[${prefixSet}]`,
      )
    })
}

generateIcon()
