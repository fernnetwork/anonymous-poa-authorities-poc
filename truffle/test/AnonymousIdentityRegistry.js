'use strict'
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
chai.use(chaiAsPromised)

// ring signature for message '0xd3fd354067184687956bc8618a26e335'
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

  it('should reject new entry to list when invalid signature provided', async () => {
    const { pubKeys, tag, tees, cees } = signature

    try {
      await contract.addToList(
        'unsigned message',
        entry,
        flat(pubKeys),
        tag,
        tees,
        cees
      )
    } catch (err) {
      expect(err.reason).to.equal('Invalid signature')
    }
  })

  it('should accept new entry to list when valid signature provided', async () => {
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

  it('should reject new entry to list when a duplicate signature is provided', async () => {
    const { pubKeys, tag, tees, cees } = signature

    try {
      await contract.addToList(
        listId,
        '0x6d480772b57e91f1c4e1cc196df88896d27ed327',
        flat(pubKeys),
        tag,
        tees,
        cees
      )
    } catch (err) {
      expect(err.reason).to.equal('Duplicate signature')
    }
  })

  it('should return all entries for the list', async () => {
    const result = await contract.getList(listId)
    expect(result).to.deep.equal([ entry ])
  })

  // TODO loop - do the same thing for all identities in the pubKeys list, fill up the list
  // TODO add initial hash transaction
  // TODO add more validation
})
