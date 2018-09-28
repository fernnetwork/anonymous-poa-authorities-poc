
'use strict'

const { execSync } = require('child_process')
const inquirer = require('inquirer')

const dockerCmd = 'docker run --rm -v $(PWD)/out:/usr/src/app/out linkable-ring-sig python 2_sign_message.py'

const messagePrompt = {
  message: 'What is the message',
  name: 'message',
  type: 'input'
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
