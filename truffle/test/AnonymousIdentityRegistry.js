'use strict'

const { assert, expect, expectErrorReason } = require('./utils/testHelper.js')
const AnonymousIdentityRegistry = artifacts.require('./AnonymousIdentityRegistry.sol')

const listId = '0xd3fd354067184687956bc8618a26e335' // message being signed
const signature = require('./data/signature_0.json') // valid signature for the above listId
const signatureDiffMsg = require('./data/signature_0_hello.json') // valid signature for string 'hello'

const flat = arr => arr.reduce((previous, current) => previous.concat(current), [])
const createEntryHash = (tees, entry) => web3.utils.soliditySha3({ t: 'uint256[10]', v: tees }, { t: 'address', v: entry })

contract('AnonymousIdentityRegistry', accounts => {
  const owner = accounts[0]
  let contract

  before(async () => {
    contract = await AnonymousIdentityRegistry.deployed()
  })

  describe('creating a list', () => {
    it('should not allow anyone other than owner to create new list', async () => {
      expectErrorReason(
        () => contract.createList(listId, flat(signature.pkeys), { from: accounts[1] }),
        'Unauthorized operation'
      )
    })

    it('should allow contract owner to create new list', async () => {
      const { logs } = await contract.createList(listId, flat(signature.pkeys))
      const { event, args } = logs[0]
      expect(logs.length).to.equal(1)
      expect(event).to.equal('ListCreated')
      expect(args.listId).to.equal(listId)
    })

    it('should reject adding a duplicate list', async () => {
      expectErrorReason(
        () => contract.createList(listId, flat(signature.pkeys)),
        'List already exists'
      )
    })
  })

  describe('when adding an item to list', () => {
    it('should reject new entry to list when an invalid signature is provided', async () => {
      const { tag, tees, seed } = signatureDiffMsg

      expectErrorReason(
        () => contract.addToList(
          listId,
          accounts[0],
          tag,
          tees,
          seed
        ),
        'Invalid signature'
      )
    })

    it('should reject new entry when list does not exist', async () => {
      const { tag, tees, seed } = signatureDiffMsg
      const entry = accounts[0]

      expectErrorReason(
        () => contract.addToList(
          'hello',
          entry,
          tag,
          tees,
          seed
        ),
        'List does not exist'
      )
    })

    it('should reject new entry without a valid commit hash', async () => {
      const { tag, tees, seed } = signature
      const entry = accounts[0]

      expectErrorReason(
        () => contract.addToList(
          listId,
          entry,
          tag,
          tees,
          seed
        ),
        'No matching commit hash'
      )
    })

    it('should accept new entry to list when a valid commit hash and signature is provided', async () => {
      const { tag, tees, seed } = signature
      const entry = accounts[0]

      await contract.commitToList(listId, createEntryHash(tees, entry))

      const { logs } = await contract.addToList(
        listId,
        entry,
        tag,
        tees,
        seed
      )

      const { event, args } = logs[0]
      expect(logs.length).to.equal(1)
      expect(event).to.equal('ListItemAdded')
      expect(args.listId).to.equal(listId)
      expect(args.anonymousId).to.equal(entry)
    })

    it('should reject duplicate entry to list by a different signer', async () => {
      // different signature, duplicate entry
      const { tag, tees, seed } = require('./data/signature_1.json')
      const entry = accounts[0]
      await contract.commitToList(listId, createEntryHash(tees, entry))

      expectErrorReason(
        () => contract.addToList(
          listId,
          entry,
          tag,
          tees,
          seed
        ),
        'Identity has already been added'
      )
    })

    it('should reject new entry to list when a duplicate signature is provided', async () => {
      // duplicate signature, different entry
      const { tag, tees, seed } = signature
      await contract.commitToList(listId, createEntryHash(tees, accounts[1]))

      expectErrorReason(
        () => contract.addToList(
          listId,
          accounts[1],
          tag,
          tees,
          seed
        ),
        'Duplicate signature'
      )
    })

    it('should emit a ListFilled event when all slots are filled', async () => {
      let lastResponse

      for (let i = 1; i < 10; i++) {
        const sig = require(`./data/signature_${i}.json`)

        const { tag, tees, seed } = sig

        await contract.commitToList(listId, createEntryHash(tees, accounts[i]))

        lastResponse = contract.addToList(
          listId,
          accounts[i],
          tag,
          tees,
          seed
        )
      }

      const { logs } = await lastResponse
      const listFilledEvent = logs.find(log => log.event === 'ListFilled')
      expect(listFilledEvent).not.to.be.undefined
      expect(listFilledEvent.args.listId).to.equal(listId)
    })
  })

  describe('getList', () => {
    it('should return all entries for the list', async () => {
      const result = await contract.getList(listId)
      expect(result.length).to.be.equal(10)
      expect(result).to.have.members(accounts)
    })
  })

  // TODO remove hard coded array size
})
