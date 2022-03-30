/**
 * git提交 message 的一些规则限定
 * 注意：
 *    级别 [0..2]：0禁用规则。因为1它将被视为2错误警告。 适用 always|never：never颠倒规则。 值：用于此规则的值。
 *    注意提交的格式：  类型(模块): 内容 -------特别注意冒号为英文，冒号后边跟着一个空格
 */

module.exports = {
  ignores: [commit => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'], // body换行
    'footer-leading-blank': [1, 'always'], // <footer> 以空行开头
    'header-max-length': [2, 'always', 108], // header 最长72
    'subject-empty': [2, 'never'], // <subject> 不能为空
    'type-empty': [2, 'never'], // <type> 不能为空
    'subject-case': [0], // type小写
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'update',
        'fix',
        'perf',
        'style',
        'docs',
        'test',
        'refactor',
        'build',
        'ci',
        'chore',
        'revert',
        'wip',
        'types',
      ],
    ],
  },
}
/**
 * feat 增加新功能
 * update 更新某功能
 * fix 修复问题/BUG
 * style 代码风格相关无影响运行结果的
 * perf 优化/性能提升
 * refactor 重构
 * revert 撤销修改
 * test 测试相关
 * docs 文档/注释
 * chore 依赖更新/脚手架配置修改等
 * ci 持续集成
 * wip 开发中
 * types 类型修改
 * build 依赖相关的内容修改
 */

/* 
  用法示例 格式：
    <type>(<scope>): <subject>
    <BLANK LINE>
    <body>
    <BLANK LINE>
    <footer></footer>
*/
