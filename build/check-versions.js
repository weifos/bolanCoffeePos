'use strict'
const chalk = require('chalk')
const semver = require('semver')
const packageConfig = require('../package.json')
const shell = require('shelljs')

// 脚本可以通过 child_process 模块新建子进程，从而执行 Unix 系统命令
// 下面这段代码实际就是把cmd这个参数传递的值，转化成前后没有空格的字符串，也就是版本号
function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}

const versionRequirements = [
  {
    name: 'node',
    // 当前环境版本，使用semver插件把当前环境版本信息转化成规定格式，也就是 ‘  =v1.2.3  ‘ -> ‘1.2.3‘ 这种功能
    currentVersion: semver.clean(process.version),
    // 要求的版本，这是规定的pakage.json中engines选项的node版本信息 "node":">= 4.0.0"
    versionRequirement: packageConfig.engines.node
  }
]

// npm环境中
if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    // 执行方法得到版本号
    currentVersion: exec('npm --version'),
    // 要求的版本
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  const warnings = []
  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]
    //上面这个判断就是如果版本号不符合package.json文件中指定的版本号，就执行下面的代码
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()
    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }
    console.log()
    process.exit(1)
  }
}
