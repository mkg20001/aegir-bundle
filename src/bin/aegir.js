#!/usr/bin/env node

'use strict'

const download = require('../')
const fs = require('fs')

const {generateParameters} = require('../common')
const {binPath} = generateParameters()

const launch = () => {
  require(binPath) // TODO: require vs child_process
}

const error = (err) => {
  process.stdout.write(`${err}\n`)
  process.stdout.write(`Download failed!\n\n`)
  process.exit(1)
}

if (!fs.existsSync(binPath)) {
  download()
    .then(launch)
    .catch(error)
} else {
  launch()
}
