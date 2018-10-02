
'use strict'

const inquirer = require('inquirer')
const contract = require("truffle-contract")
const Web3 = require('web3')
const tempStorage = require('../temp-storage')

const UAOSRingArtifact = require('../../../truffle/build/contracts/UAOSRing.json')
const AnonymousIdentityRegistryArtifact = require('../../../truffle/build/contracts/AnonymousIdentityRegistry.json')

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
const fromAddressPrompt = {
  message: 'What is the sender address',
  name: 'fromAddress',
  type: 'input',
  default: tempStorage.get('fromAddress') || '0x00Ea169ce7e0992960D3BdE6F5D539C955316432',
  validate: (fromAddress) => {
    return ethRegex.test(fromAddress) || 'Invalid sender address'
  }
}

const deployContract = async (artifact, provider, links, txParams) => {
  const Contract = contract(artifact)
  Contract.setProvider(provider)
  await Contract.detectNetwork()

  for (const [name, link] of Object.entries(links)) {
    Contract.link(name, link.address)
  }

  return Contract.new(txParams)
}

exports.execute = async function () {
  const { providerUrl, fromAddress } = await inquirer.prompt([
    providerPrompt,
    fromAddressPrompt
  ])

  const web3Provider = providerUrl.startsWith('ws') ?
    new Web3.providers.WebsocketProvider(providerUrl) :
    new Web3.providers.HttpProvider(providerUrl)
  const txParams = { from: fromAddress }

  console.log(`Deploying AnonymousIdentityRegistry contract to ${providerUrl}...`)

  const uaosRing = await deployContract(
    UAOSRingArtifact,
    web3Provider,
    {},
    txParams
  )

  const anonymousIdentityRegistry = await deployContract(
    AnonymousIdentityRegistryArtifact,
    web3Provider,
    { UAOSRing: uaosRing },
    txParams
  )

  const contractAddress = anonymousIdentityRegistry.address
  tempStorage.put({ providerUrl, fromAddress, contractAddress })

  return `AnonymousIdentityRegistry contract successfully deployed to ${contractAddress}.`
}
