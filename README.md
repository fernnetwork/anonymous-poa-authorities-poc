# fern anonymous identity registry poc
Anonymous identity registry PoC using linkable ring signatures.

See the design of the PoC [here](https://github.com/appliedblockchain/fern-research/blob/master/experiments/solcrypto-python/README.md)

## How does it work?
1. Create key pairs using [solcrypto](https://github.com/HarryR/solcrypto)
2. Registry owner deploy [AnonymousIdentityRegistry](truffle/contracts/AnonymousIdentityRegistry.sol) contract
3. Registry owner create a list with  list id and authorised pub keys
3. User create linkable ring signature of a hash of `listId`, using the [solcrypto](https://github.com/HarryR/solcrypto/blob/master/pysolcrypto/uaosring.py) library.
4. User sends a hash of the generated ring sig and hash of the entry value to the [AnonymousIdentityRegistry](truffle/contracts/AnonymousIdentityRegistry.sol) contract
5. User sends the original ring sig and entry value to the [AnonymousIdentityRegistry](truffle/contracts/AnonymousIdentityRegistry.sol) contract
6. The [AnonymousIdentityRegistry](truffle/contracts/AnonymousIdentityRegistry.sol) contract verify ring signature and add entry to list

## Code 
- Basic working version of the [AnonymousIdentityRegistry](truffle/contracts/AnonymousIdentityRegistry.sol) contract
- All test cases for implemented features [here](truffle/test/AnonymousIdentityRegistry.js)

## Implemented features
- Registry Contract owner can create a list, providing a listId and authorised list of pubkeys
- Authorised pubkey owners can add entry to a list, providing a valid and unique linkable ring signature
- Ability to retrieve all entries from the list

## Next steps
- Python/docker script to simplify key and ring signature generation and convert to more understandable format e.g. JSON (currently writing tuples and lists of numbers to console and need to do some manual manipulation before using them in JS/solidity)
- Add test cases to simulate adding entries for all authorised users
- Add initial hash commit transaction and hash verification to prevent transaction sniping
- Ring sig algorithm validation / audit by crypto expert

## Out of scope for PoC
- Efficiency & gas usage optimization
