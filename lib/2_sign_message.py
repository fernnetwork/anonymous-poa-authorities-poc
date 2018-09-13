from pysolcrypto.uaosring import uaosring_check, uaosring_sign
from pysolcrypto.utils import bytes_to_int
from py_ecc.bn128.bn128_field_elements import FQ
from hashlib import sha256
from utils import point_str_array_to_tuple, point_tuple_to_str_array
import json

def create_hash(raw_msg):
  return bytes_to_int(sha256(raw_msg.encode('utf-8')).digest())

temp_dir = 'temp'
raw_msg = '0xd3fd354067184687956bc8618a26e335'
my_pair_idx = 0

# Load keys
with open(temp_dir + '/all_pkeys.json') as json_file:  
    pkeys_json = json.load(json_file)
    pkeys = list(map(lambda pkey: point_str_array_to_tuple(pkey), pkeys_json))

with open(temp_dir + '/keypair_{}.json'.format(str(my_pair_idx))) as json_file:  
    my_pair_json = json.load(json_file)
    pkey = point_str_array_to_tuple(my_pair_json['pkey'])
    skey = int(my_pair_json['skey'])
    my_pair = (pkey, skey)

# Sign message 
msg = create_hash(raw_msg)
print('Signing message: ' + raw_msg)
print('Message hash: ' + str(msg))
sig = uaosring_sign(pkeys, my_pair, message=msg)

# Verify signature
print('Verify generated signature: ' + str(uaosring_check(*sig, message=msg)))

sig_path = '{}/signature.json'.format(temp_dir)

with open(sig_path, 'w') as outfile:  
  json.dump({
    'pkeys': list(map(lambda x: point_tuple_to_str_array(x), sig[0])),
    'tag': point_tuple_to_str_array(sig[1]),
    'tees': list(map(lambda n: str(n), sig[2])),
    'seed': str(sig[3])
  }, outfile, indent=2)

print('Signature generated: {}'.format(sig_path))
