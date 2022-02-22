from cgi import test
from struct import pack, unpack

teststr = bytearray('01asdf', 'utf-8')

a = unpack('H', teststr[:2])
print(a[0])
print(type(a[0]))