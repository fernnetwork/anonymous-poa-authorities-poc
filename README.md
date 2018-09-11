# fern anonymous identity registry poc
Anonymous identity registry PoC using linkable ring signatures.

See the design of the PoC [here](https://github.com/appliedblockchain/fern-research/blob/master/experiments/solcrypto-python/README.md)

## High level steps:
1. Create 10 key pairs
2. Deploy contract with pub keys and list id
3. User signs a hash of listId => linkable ring sig
4. User sends a hash of ring sig and entry
5. User sends the original ring sig and entry value
6. Contract verify inputs
