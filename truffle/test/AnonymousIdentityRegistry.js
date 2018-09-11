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
  const entry = '0x9b7B86FC70bA2aD53e98d5F8F852c3629F813c7a'
  let contract

  before(async () => {
    contract = await AnonymousIdentityRegistry.deployed()
  })

  it('should create new list', async () => {
    const { logs } = await contract.createList(listId, flat(signature.pubKeys))
    
    const { event, args } = logs[0]
    expect(logs.length).to.equal(1)
    expect(event).to.equal('ListCreated')
    expect(args.listId).to.equal(listId)
  })

  it('should accpet new entry to list when valid signature provided', async () => {
    const { pubKeys, tag, tees, cees } = signature
    const { logs } = await contract.addToList(
      listId,
      entry,
      flat(pubKeys),
      tag,
      tees,
      cees
    )

    const { event, args } = logs[0]
    expect(logs.length).to.equal(1)
    expect(event).to.equal('ListItemAdded')
    expect(args.listId).to.equal(listId)
    expect(args.anonymousId).to.equal(entry)
  })

  it('should return all entries for the list', async () => {
    const result = await contract.getList(listId)
    expect(result).to.deep.equal([ entry ])
  })

  // TODO loop - do the same thing for all identities in the pubKeys list, fill up the list
  // TODO add initial hash transaction
  // TODO add more validation
})
