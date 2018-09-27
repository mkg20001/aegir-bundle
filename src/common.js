'use strict'

const os = require('os')
const path = require('path')

let pkg
let aegirVersion

try {
  pkg = require('./../package.json')
  aegirVersion = pkg.aegir
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
    version = process.env.AEGIR_VERSION || version || aegirVersion
    platform = process.env.AEGIR_PLATFORM || platform || (C.platformMap[process.platform] || 'linux')
    installPath = process.env.AEGIR_PATH || installPath || C.generatePath(platform)
  }
}
