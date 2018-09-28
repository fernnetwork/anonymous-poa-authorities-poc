from pysolcrypto.uaosring import uaosring_check, uaosring_sign
from pysolcrypto.utils import bytes_to_int
from py_ecc.bn128.bn128_field_elements import FQ
from hashlib import sha256
from utils import point_str_array_to_tuple, point_tuple_to_str_array
import json
import argparse
import sys

def create_hash(raw_msg):
  return bytes_to_int(sha256(raw_msg.encode('utf-8')).digest())

parser = argparse.ArgumentParser(description='Sign a message using linkable ring signature scheme.')
parser.add_argument(
  'message', metavar='message', help='message to sign')
parser.add_argument(
  'all_pkeys', metavar='out/pkeys.json', nargs='?', default='out/all_pkeys.json', help='path of the pkeys.json file')
parser.add_argument(
  'my_key_pair', metavar='out/keypair.json', nargs='?', default='out/keypair_0.json', help='path of the keypair.json file')
parser.add_argument(
  'outfile', metavar='out/signature.json', nargs='?', default='out/signature.json', help='target path of the generated signature')

args = parser.parse_args()

raw_msg = args.message
all_pkeys_path = args.all_pkeys
my_key_pair_path = args.my_key_pair
sig_path = args.outfile
print(args)

# Load keys
with open(all_pkeys_path) as json_file:  
    pkeys_json = json.load(json_file)
    pkeys = list(map(lambda pkey: point_str_array_to_tuple(pkey), pkeys_json))

with open(my_key_pair_path) as json_file:  
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

with open(sig_path, 'w') as outfile:  
  json.dump({
    'pkeys': list(map(lambda x: point_tuple_to_str_array(x), sig[0])),
    'tag': point_tuple_to_str_array(sig[1]),
    'tees': list(map(lambda n: str(n), sig[2])),
    'seed': str(sig[3])
  }, outfile, indent=2)

print('Signature generated: {}'.format(sig_path))
