
'use strict'

const fs = require('fs')
const inquirer = require('inquirer')
const Web3 = require('web3')
const { abi: contractAbi } = require('../../../truffle/build/contracts/AnonymousIdentityRegistry.json')

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

const listIdPrompt = {
  message: 'What is the list ID',
  name: 'listId',
  type: 'input',
  default: '3087b74c-5235-49b8-a8c2-e00b89fa133a',
  validate: (listId) => {
    return !!listId || 'Empty list ID'
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
  const { web3Provider, contractAddress, listId, fromAddress } = await inquirer.prompt([
    providerPrompt,
    contractAddressPrompt,
    listIdPrompt,
    fromAddressPrompt
  ])

  const web3 = new Web3(web3Provider)
  const anonymousIdentityRegistry = new web3.eth.Contract(contractAbi, contractAddress)

  const result = await anonymousIdentityRegistry.methods.getList(listId).call({ from: fromAddress, gas: 500000 })
  return `List ${listId}: ${JSON.stringify(result)}`
}
