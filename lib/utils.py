
from py_ecc.bn128.bn128_field_elements import FQ

# convert point to a JSON serializable format
def point_tuple_to_str_array(pkey):
  return list(map(lambda x: str(x), pkey))

# convert point from a JSON serializable format to an int tuple
def point_str_array_to_tuple(pkey):
  return (FQ(int(pkey[0])), FQ(int(pkey[1])))
