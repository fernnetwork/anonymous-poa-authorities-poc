
'use strict'

const inquirer = require('inquirer')
const Web3 = require('web3')
const tempStorage = require('../temp-storage')
const { abi: contractAbi } = require('../../../truffle/build/contracts/AnonymousIdentityRegistry.json')

const providerRegex = /(?:(?:http)|(?:ws)):\/\/.+/
const providerPrompt = {
  message: 'What is web3 provider endpoint',
  name: 'providerUrl',
  type: 'input',
  default: tempStorage.get('providerUrl') || 'ws://localhost:8546',
  validate: (providerUrl) => {
    return providerRegex.test(providerUrl) || 'Invalid provider address'
  }
}

const ethRegex = /\b(?:0x)?[a-f0-9]{40}\b/i
const contractAddressPrompt = {
  message: 'What is the AnonymousIdentityRegistry contract address',
  name: 'contractAddress',
  type: 'input',
  default: tempStorage.get('contractAddress') || '0x5A96700CE6C818Aca4706AfcDEe00F94AEb07Ebc',
  validate: (contractAddress) => {
    return ethRegex.test(contractAddress) || 'Invalid contract address'
  }
}

const listIdPrompt = {
  message: 'What is the list ID',
  name: 'listId',
  type: 'input',
  default: tempStorage.get('listId') || '3087b74c-5235-49b8-a8c2-e00b89fa133a',
  validate: (listId) => {
    return !!listId || 'Empty list ID'
  }
}

const fromAddressPrompt = {
  message: 'What is the sender address',
  name: 'fromAddress',
  type: 'input',
  default: tempStorage.get('fromAddress') || '0x00Ea169ce7e0992960D3BdE6F5D539C955316432',
  validate: (fromAddress) => {
    return ethRegex.test(fromAddress) || 'Invalid sender address'
  }
}

exports.execute = async function () {
  const { providerUrl, contractAddress, listId, fromAddress } = await inquirer.prompt([
    providerPrompt,
    contractAddressPrompt,
    listIdPrompt,
    fromAddressPrompt
  ])

  const web3 = new Web3(providerUrl)
  const anonymousIdentityRegistry = new web3.eth.Contract(contractAbi, contractAddress)

  const result = await anonymousIdentityRegistry.methods.getList(listId)
    .call({ from: fromAddress, gas: 5000000 })

  return `List ${listId}: ${JSON.stringify(result)}`
}
