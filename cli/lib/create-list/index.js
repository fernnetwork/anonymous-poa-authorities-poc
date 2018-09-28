
'use strict'

const fs = require('fs')
const inquirer = require('inquirer')
const uuidv4 = require('uuid/v4')
const Web3 = require('web3')
const { abi: contractAbi } = require('../../../truffle/build/contracts/AnonymousIdentityRegistry.json')

const flat = arr => arr.reduce((previous, current) => previous.concat(current), [])

const providerRegex = /(?:(?:http)|(?:ws)):\/\/.+/
const providerPrompt = {
  message: 'What is web3 provider endpoint',
  name: 'web3Provider',
  type: 'input',
  default: 'ws://localhost:8546',
  validate: (web3Provider) => {
    return providerRegex.test(web3Provider) || 'Invalid provider address'
  }
}

const pkeysPrompt = {
  message: 'What is location of the pkeys.json file',
  name: 'pkeysJSONPath',
  type: 'input',
  default: '../lib/out/all_pkeys.json',
  validate: (pkeysJSONPath) => {
    const pkeys = readJSONFromFile(pkeysJSONPath)
    return (pkeys && pkeys.length > 0) || 'Invalid pkeys.json file'
  }
}

const ethRegex = /\b(?:0x)?[a-f0-9]{40}\b/i
const contractAddressPrompt = {
  message: 'What is the AnonymousIdentityRegistry contract address',
  name: 'contractAddress',
  type: 'input',
  default: '0x5A96700CE6C818Aca4706AfcDEe00F94AEb07Ebc',
  validate: (contractAddress) => {
    return ethRegex.test(contractAddress) || 'Invalid contract address'
  }
}

const fromAddressPrompt = {
  message: 'What is the sender address',
  name: 'fromAddress',
  type: 'input',
  default: '0x00Ea169ce7e0992960D3BdE6F5D539C955316432',
  validate: (fromAddress) => {
    return ethRegex.test(fromAddress) || 'Invalid sender address'
  }
}

exports.execute = async function () {
  const { web3Provider, pkeysJSONPath, contractAddress, fromAddress } = await inquirer.prompt([
    providerPrompt,
    contractAddressPrompt,
    fromAddressPrompt,
    pkeysPrompt
  ])
  
  const web3 = new Web3(web3Provider)
  const anonymousIdentityRegistry = new web3.eth.Contract(contractAbi, contractAddress)

  const pkeys = readJSONFromFile(pkeysJSONPath)
  const listId = uuidv4()

  await anonymousIdentityRegistry.methods.createList(listId, flat(pkeys)).send({ from: fromAddress })
  return `List ${listId} created by ${fromAddress}.`
}

function readJSONFromFile(path) {
  const fileContent = fs.readFileSync(path)
  return JSON.parse(fileContent)
}
