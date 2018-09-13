# Ring signature library

## Prequisites
- Docker

## Build docker image
```
docker build -t linkable-ring-sig .
```

## Generate key pairs
Run the following command, this will generate 10 key pairs:
```
docker run -it --rm -v "$PWD"/temp:/usr/src/app/temp linkable-ring-sig python 1_generate_key_pairs.py
```

Outputs can be found under the `temp` directory:
- `all_pkeys.json`: list of generated public keys
- `keypair_{index}.json`: generate public and private key pair

## Generate linkable ring signature for a message
Run the following command, this will generate a linkable ring signature for a message `0xd3fd354067184687956bc8618a26e335` using keypair `keypair_0.json`, and all public keys generated from the earlier step:
```
docker run -it --rm -v "$PWD"/temp:/usr/src/app/temp linkable-ring-sig python 2_sign_message.py
```

Output can be found at `temp/signature.json`. 

## TODO
- Make hard coded values such as `num_of_keys`, `message`, `pkeys_path` and `keypair_path` configurable and to make it possible to pass these options as arguments like belong:
```
alias cmd="docker run -it --rm -v $(PWD)/temp:/usr/src/app/temp linkable-ring-sig python"
cmd 1_generate_key_pairs.py 10
cmd 2_sign_message.py "my_message" temp/all_pkeys.json temp/keypair_0.json
```
