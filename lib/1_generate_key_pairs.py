import os
import shutil
import json
import argparse
from pysolcrypto.uaosring import uaosring_randkeys
from utils import point_tuple_to_str_array

parser = argparse.ArgumentParser(description='Generate key pair.')
parser.add_argument('num_of_keys', nargs='?', default=10, type=int, help='number of key pairs to generate')
args = parser.parse_args()
print(args)

num_of_keys = args.num_of_keys
temp_dir = 'out'

pkeys = []
print('Generating ' + str(num_of_keys) + ' random keys...')

for i in range(0, num_of_keys):
  keypair = uaosring_randkeys(1)
  pkey = point_tuple_to_str_array(keypair[1][0])
  skey = str(keypair[1][1])
  pkeys.append(pkey)

  with open('{}/keypair_{}.json'.format(temp_dir, i), 'w') as outfile:  
    json.dump({
      'pkey': pkey,
      'skey': skey
    }, outfile, indent=2)

with open('{}/all_pkeys.json'.format(temp_dir), 'w') as outfile:  
    json.dump(pkeys, outfile, indent = 2)

print('Keys generated under directory: ' + temp_dir + '/')
