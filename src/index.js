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

const nugget = require('nugget')
const fs = require('fs')

const gunzip = require('gunzip-maybe')
const tarFS = require('tar-fs')

const {generateParameters} = require('./common')

// Main function
function download (...args) {
  return new Promise((resolve, reject) => {
    const {version, platform, installPath, binPath} = generateParameters(...args)

    // Create the download url
    const fileName = platform + '.tar.gz'
    const url = 'https://aegir.mkg20001.io/' + version + '/' + fileName
    let dl

    // Success callback wrapper
    const done = () => {
      if (dl && dl.progress.percentage !== 100) {
        return reject(new Error('Download interrupted'))
      }

      fs.writeFileSync(binPath + '.ok', '')
      resolve({
        fileName,
        installPath
      })
    }

    if (fs.existsSync(binPath + '.ok')) {
      return done()
    }

    // Unpack the response stream
    const unpack = (stream) => {
      // TODO: handle errors
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

    dl = nugget(url, {target: fileName, streamOnly: true}, (err, stream) => {
      if (err) {
        return reject(err[0])
      }

      unpack(stream)
    })
  })
}

module.exports = download
