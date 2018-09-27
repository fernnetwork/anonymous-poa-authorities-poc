# Fern Anonymous Identity Registry PoC
Anonymous identity registry PoC using linkable ring signatures.

See the design of the PoC [here](https://github.com/appliedblockchain/fern-research/blob/master/experiments/solcrypto-python/README.md)

## How does it work?
1. Generate key pairs using script [1_generate_key_pairs.py](lib/1_generate_key_pairs.py). See instructions [here](lib/README.md).
2. Registry owner deploy [AnonymousIdentityRegistry](truffle/contracts/AnonymousIdentityRegistry.sol) contract.
3. Registry owner create a list with list id and a set of authorised pub keys.
3. User create linkable ring signature of a `listId` hash, using script [2_sign_message.py](lib/2_sign_message.py). See instructions [here](lib/README.md)
4. User sends a hash of the generated ring sig tag and the entry value to the [AnonymousIdentityRegistry](truffle/contracts/AnonymousIdentityRegistry.sol) contract (could potentially authenticate this using a non linkable ring signature)
```
const { tag, tees, seed } = require('./signature.json')
const myAnonymousId = '0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5'
const createEntryHash = (tag, entry) => web3.utils.soliditySha3({ t: 'uint256[2]', v: tag }, { t: 'address', v: entry })

await contract.methods.commitToList(listId, createEntryHash(tag, myAnonymousId))
  .send({ from: myAnonymousId })
```
5. User sends the raw ring sig and entry value to the [AnonymousIdentityRegistry](truffle/contracts/AnonymousIdentityRegistry.sol#) contract
```
const { tag, tees, seed } = require('./signature.json')
await contract.methods.addToList(listId, myAnonymousId, tag, tees, seed)
  .send({ from: myAnonymousId })
```
6. The [AnonymousIdentityRegistry](truffle/contracts/AnonymousIdentityRegistry.sol) contract verifies the ring signature and adds the entry to list

## Implemented features
- Generate keypairs and output to a JSON file
- Generate linkable ring signatures and output to a JSON file
- Registry Contract owner can create a list, providing a listId and authorised list of pubkeys
- Authorised pubkey owners can add entry to a list, providing a valid and unique linkable ring signature
- Ability to retrieve all entries from the list

## Next steps
- Ring sig algorithm validation / audit by crypto expert

## Out of scope for PoC
- Efficiency & gas usage optimization
