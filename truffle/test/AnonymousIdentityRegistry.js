'use strict'
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
chai.use(chaiAsPromised)

const signature = require('./data/signature.json')
const AnonymousIdentityRegistry = artifacts.require('./AnonymousIdentityRegistry.sol')

const flat = arr => arr.reduce((previous, current) => previous.concat(current), [])

contract('AnonymousIdentityRegistry', accounts => {
  const owner = accounts[0]
  const listId = '0xd3fd354067184687956bc8618a26e335'
  let contract

  before(async () => {
    contract = await AnonymousIdentityRegistry.deployed()
  })

  it('should create new list', async () => {
    const { receipt } = await contract.createList(listId, flat(signature.pubKeys))
    expect(receipt).to.not.be.null
  })

  it('should accpet new entry to list when valid signature provided', async () => {
    const { pubKeys, tag, tees, cees } = signature
    const { receipt } = await contract.addToList(
      listId,
      '0x9b7b86fc70ba2ad53e98d5f8f852c3629f813c7a',
      flat(pubKeys),
      tag,
      tees,
      cees
    )
    expect(receipt).to.not.be.null
  })

})
