'use strict'

const fs = require('fs')

const tempFilePath = 'temp.json'
const tempStorage = loadFromFile(tempFilePath) || {}
const JSON_INDENT = 2

const get = key => tempStorage[key]

const put = (keyValuePairs = {}) => {
  for (const [ key, value ] of Object.entries(keyValuePairs)) {
    if (tempStorage[key] !== value) {
      tempStorage[key] = value
    }
  }
  fs.writeFileSync(tempFilePath, JSON.stringify(tempStorage, null, JSON_INDENT))
}

function loadFromFile(path) {
  if (fs.existsSync(path)) {
    try {
      const fileContent = fs.readFileSync(path)
      return JSON.parse(fileContent)
    } catch (e) {
      console.error('Invalid temp storage file.')
    }
  }
}

module.exports = { get, put }
