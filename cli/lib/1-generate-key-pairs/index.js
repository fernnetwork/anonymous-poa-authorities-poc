
'use strict'

const { execSync } = require('child_process')
const inquirer = require('inquirer')

const dockerCmd = 'docker run --rm -v $(PWD)/out:/usr/src/app/out linkable-ring-sig python 1_generate_key_pairs.py'
const numOfKeysPrompt = {
  message: 'How many key pairs would you like to generate',
  name: 'numOfKeys',
  type: 'input',
  default: '1'
}

exports.execute = async function () {
  const { numOfKeys } = await inquirer.prompt([
    numOfKeysPrompt
  ])

  return execSync(`${dockerCmd} ${numOfKeys}`, { encoding: 'utf-8' })
}
