'use strict'

const os = require('os')
const path = require('path')

let pkg
let aegirDefaultVersion = require('./../package.json').aegir
let aegirVersion

try {
  if (__dirname.indexOf('node_modules')) {
    pkg = require(path.join(__dirname.split('node_modules')[0], 'package.json'))
    aegirVersion = pkg.aegir
  }
} catch (e) {
  // do nothing
}

const C = module.exports = {
  aegirVersion,
  generatePath (version) {
    return path.join(os.homedir(), '.aegir', version)
  },
  platformMap: {
    darwin: 'macos',
    win32: 'win'
  },
  generateParameters (version, platform, installPath) {
    version = process.env.AEGIR_VERSION || version || aegirVersion || aegirDefaultVersion
    platform = process.env.AEGIR_PLATFORM || platform || (C.platformMap[process.platform] || 'linux')
    installPath = process.env.AEGIR_PATH || installPath || C.generatePath(platform)
    const binPath = path.join(installPath, 'aegir-' + platform + '.js')

    return {version, platform, installPath, binPath}
  }
}
