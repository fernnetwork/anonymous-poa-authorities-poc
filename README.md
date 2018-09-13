# Fern Anonymous Identity Registry PoC
Anonymous identity registry PoC using linkable ring signatures.

See the design of the PoC [here](https://github.com/appliedblockchain/fern-research/blob/master/experiments/solcrypto-python/README.md)

## How does it work?
1. Generate key pairs using script [1_generate_key_pairs.py](lib/1_generate_key_pairs.py). See instructions [here](lib/README.md).
2. Registry owner deploy [AnonymousIdentityRegistry](truffle/contracts/AnonymousIdentityRegistry.sol) contract.
3. Registry owner create a list with list id and a set of authorised pub keys.
3. User create linkable ring signature of a `listId` hash, using script [2_sign_message.py](lib/2_sign_message.py). See instructions [here](lib/README.md)
4. User sends a hash of the generated ring sig and hash of the entry value to the [AnonymousIdentityRegistry](truffle/contracts/AnonymousIdentityRegistry.sol) contract (could potentially authenticate this using a non linkable ring signature)
5. User sends the original ring sig and entry value to the [AnonymousIdentityRegistry](truffle/contracts/AnonymousIdentityRegistry.sol) contract
6. The [AnonymousIdentityRegistry](truffle/contracts/AnonymousIdentityRegistry.sol) contract verify ring signature and add entry to list

## Implemented features
- Generate keypairs and output to a JSON file
- Generate linkable ring signatures and output to a JSON file
- Registry Contract owner can create a list, providing a listId and authorised list of pubkeys
- Authorised pubkey owners can add entry to a list, providing a valid and unique linkable ring signature
- Ability to retrieve all entries from the list

## Next steps
- Add initial hash commit transaction and hash verification to prevent transaction sniping
- Ring sig algorithm validation / audit by crypto expert

## Out of scope for PoC
- Efficiency & gas usage optimization
