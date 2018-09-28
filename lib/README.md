# Ring signature library

## Prequisites
- Docker

## Build docker image
```
docker build -t linkable-ring-sig .
```

## Generate key pairs
Run the following commands, this will generate 10 key pairs:
```
# add an alias to docker run
alias lrs="docker run -it --rm -v $(PWD)/out:/usr/src/app/out linkable-ring-sig python"

# show help
lrs 1_generate_key_pairs.py -h 

# generate 10 key pairs
lrs 1_generate_key_pairs.py 10
```

Outputs can be found under the `out` directory:
- `all_pkeys.json`: list of generated public keys
- `keypair_{index}.json`: generate public and private key pair

## Generate linkable ring signature for a message
Run the following command, this will generate a linkable ring signature for a message `hello` using keypair `keypair_0.json`, and all public keys generated from the earlier step:
```
# show help
lrs 2_sign_message.py -h

# sign message "hello" using keypair_0.json
lrs 2_sign_message.py 'hello' out/all_pkeys.json out/keypair_0.json
```

Output can be found at `out/signature.json`. 
