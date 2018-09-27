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
const request = require('request')
const tarFS = require('tar-fs')

const {generateParameters} = require('./common')

// Main function
function download (...args) {
  return new Promise((resolve, reject) => {
    const {version, platform, installPath} = generateParameters(...args)

    // Create the download url
    const fileExtension = '.tar.gz'
    const fileName = platform + '-' + fileExtension
    const url = 'https://aegir.mkg20001.io/' + version + '/' + fileName

    // Success callback wrapper
    const done = () => resolve({
      fileName,
      installPath
    })

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
