
'use strict'

const { execSync } = require('child_process')
const inquirer = require('inquirer')
const tempStorage = require('../temp-storage')

const dockerCmd = 'docker run --rm -v $(PWD)/out:/usr/src/app/out fernnetwork/linkable-ring-sig python 2_sign_message.py'

const messagePrompt = {
  message: 'What is the message',
  name: 'message',
  type: 'input',
  default: tempStorage.get('listId') || '3087b74c-5235-49b8-a8c2-e00b89fa133a'
}

const pkeysPrompt = {
  message: 'What is the pkeys.json path',
  name: 'pkeysPath',
  type: 'input',
  default: 'out/all_pkeys.json'
}

const keyPairPrompt = {
  message: 'What is the key_pair.json path',
  name: 'keyPairPath',
  type: 'input',
  default: 'out/keypair_0.json'
}

exports.execute = async function () {
  const { message, pkeysPath, keyPairPath } = await inquirer.prompt([
    messagePrompt,
    pkeysPrompt,
    keyPairPrompt
  ])

  return execSync(`${dockerCmd} '${message}' ${pkeysPath} ${keyPairPath}`, { encoding: 'utf-8' })
}
