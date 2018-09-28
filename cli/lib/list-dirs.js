'use strict'

const { readdirSync, statSync } = require('fs')
const { join } = require('path')

exports.dirs = function (dir) {
  return readdirSync(dir)
  .filter(file => {
    const absolutePath = join(dir, file)
    return statSync(absolutePath).isDirectory()
  })
}
