# this file parses the single source of truth interface definition file
import toml

def_interface = toml.load('terminal/interface.toml')

b = def_interface['CONNECT']['input']['CMD_ID']['value']
c = def_interface['DISCONNECT']['input']['CMD_ID']['value']
print(b,c)
a = b'02'
print(a)

def hi():
    print('yay')
def bye():
    print('nay')

command_op = {
    2 : hi,
    3 : bye
}
#command_op[a]()
op = command_op.get(int(a), lambda: "Invalid")
op()
