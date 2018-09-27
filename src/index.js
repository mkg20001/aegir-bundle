'use strict'
/*
  Download aegir bundle for desired version and platform,
  and unpack it to a desired output directory.

  API:
    download([<version>, <platform>, <outputPath>])

  Defaults:
    aegir version: value in package.json/aegir
    aegir platform: the platform this program is run from
    aegir install path: os.homedir() + '/.aegir/' + version

  Example:
    const download = require('aegir-bundle')

    download("13.5.2", "linux", "/tmp/aegir"])
      .then((res) => console.log('filename:', res.file, "output:", res.dir))
      .catch((e) => console.error(e))
*/
const gunzip = require('gunzip-maybe')
const path = require('path')
const request = require('request')
const tarFS = require('tar-fs')
// const unzip = require('unzip-stream')
const os = require('os')
let pkg
let aegirVersion

try {
  pkg = require('./../package.json')
  aegirVersion = pkg.aegir
} catch (e) {
  // do nothing
}

const platformMap = {
  darwin: 'macos',
  win32: 'win'
}

// Main function
function download (version, platform, arch, installPath) {
  return new Promise((resolve, reject) => {
    //            Environment Variables           Args        Defaults
    version = process.env.TARGET_VERSION || version || aegirVersion
    platform = process.env.TARGET_OS || platform || (platformMap[process.platform] || 'linux')
    installPath = installPath ? path.resolve(installPath) : path.join(os.homedir(), '.aegir', version)

    // Flag for Windows
    // const isWindows = support.isWindows(platform)

    // Create the download url
    const fileExtension = '.tar.gz' // isWindows ? '.zip' : '.tar.gz'
    const fileName = platform + '-' + fileExtension
    const url = 'https://aegir.mkg20001.io/' + version + '/' + fileName

    // Success callback wrapper
    const done = () => resolve({
      fileName,
      installPath
    })

    // Unpack the response stream
    const unpack = (stream) => {
      // TODO: handle errors for both cases
      /* if (isWindows) {
        return stream.pipe(
          unzip
            .Extract({ path: installPath })
            .on('close', done)
        )
      } */

      return stream
        .pipe(gunzip())
        .pipe(
          tarFS
            .extract(installPath)
            .on('finish', done)
        )
    }

    // Start
    process.stdout.write(`Downloading ${url}\n`)

    request.get(url, (err, res, body) => {
      if (err) {
        // TODO handle error
        return reject(err)
      }
      // Handle errors
      if (res.statusCode !== 200) {
        reject(new Error(`${res.statusCode} - ${res.body}`))
      }
    })
      .on('response', (res) => {
      // Unpack only if the request was successful
        if (res.statusCode !== 200) {
          return
        }

        unpack(res)
      })
  })
}

module.exports = download
