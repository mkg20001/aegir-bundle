#!/usr/bin/env node

'use strict'

const download = require('../')
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

download()
  .then(launch)
  .catch(error)
