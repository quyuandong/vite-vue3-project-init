//TODO: 因为html中 stylelint暂时有问题 故暂时不进行校验
module.exports = {
  // 对指定格式文件 在提交的时候执行相应的修复命令
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': ['prettier --write--parser json'],
  'package.json': ['prettier --write'],
  '*.vue': ['eslint --fix', 'prettier --write', 'stylelint --fix'],
  // '*.{scss,less,style,html}': ['stylelint --fix', 'prettier --write'],
  '*.{scss,less,style}': ['stylelint --fix', 'prettier --write'],
  '*.md': ['prettier --write'],
}
