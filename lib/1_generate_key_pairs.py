import os
import shutil
import json
from pysolcrypto.uaosring import uaosring_randkeys
from utils import point_tuple_to_str_array

def create_dir(path):
  if os.path.exists(path):
    shutil.rmtree(path)
  os.mkdir(path)

temp_dir = 'temp'

create_dir(temp_dir)

pkeys = []
num_of_keys = 10
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
