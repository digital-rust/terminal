#!/usr/bin/env python3

import struct
import time
import platform
from serial.serialutil import SerialException
from terminal.serial_server import SerialServer
from terminal.TCP_server import TCPServer

class enum_msg_prot():
    """
        # [bytearray[uint16 CmdType][unspec Msg]]
    """
    # looking up membership in sets has constant cost (O(1)) if we wanna be overkill
    # uint16_t__msg_id_set = {
    #     b'00',
    #     b'01',
    #     b'02',
    #     b'03',
    #     b'04',}
    
    cmd_id_map = {
        "UINT16_T__TERM_ON_COM_CONNECT"             : b'00',
        "UINT16_T__TERM_ON_PORT_DISCONNECT"         : b'01',
        "UINT16_T__TERM_ON_PORT_REFRESH"            : b'02',
        "UINT16_T__TERM_ON_BAUDRATE_CHANGE"         : b'03',
        "UINT16_T__TERM_ON_TRANSMIT_DATA"           : b'04',
        "UINT16_T__TERM_ON_REQUEST_PORTS"           : b'05'
    }

class TerminalServer():

    def __init__(self):
        #default args just set for now to make my life easier
        self.working_machine = platform.system()
        self.TCPServer = TCPServer()
        self.SerialServer = SerialServer()
        self.set_default_TCP()

    def set_default_TCP(self):
        TCP_HOST = '127.0.0.1'
        TCP_PORT = 5651
        self.TCPServer.Host = TCP_HOST
        self.TCPServer.Port = TCP_PORT
        
    def activate(self):
        # Main loop of program
        with self.TCPServer as FRONTEND:
            with self.SerialServer as RS232:
                while True:
                    time.sleep(0.1)    
                    # Client Logic
                    data = FRONTEND.read_from_client()
                    if(data == -1):
                        pass
                    else:
                        data = self.parse_client_message(data) #parse msg
                        
                        if(data == "EXIT\n"):
                            print("Server is exiting\n")
                            break
                        if not data:
                            pass
                        else:
                            FRONTEND.write_to_client(data)
                    
                    # checks if there is a connection
                    if(RS232.serial_connection != None):
                        # RS232 Logic
                        data = RS232.read_serial()
                        if(data == None):
                            continue
                        else:
                            FRONTEND.write_to_client(data)
    
    def parse_client_message(self, msg):
        cmd_id      = msg[:2]                   # command id
        cmd_prot    = enum_msg_prot.cmd_id_map  # command protocol
        
        # check legacy_parser for example on how to iteratively index a dict
        if cmd_id == cmd_prot["UINT16_T__TERM_ON_COM_CONNECT"]:
            # call 'connect to port' logic
            pass
        elif cmd_id == cmd_prot["UINT16_T__TERM_ON_PORT_DISCONNECT"]:
            # call 'disconnect from port' logic
            pass
        elif cmd_id == cmd_prot["UINT16_T__TERM_ON_PORT_REFRESH"]:
            # call 'port refresh' logic
            pass
        elif cmd_id == cmd_prot["UINT16_T__TERM_ON_BAUDRATE_CHANGE"]:
            # call 'br change' logic
            pass
        elif cmd_id == cmd_prot["UINT16_T__TERM_ON_TRANSMIT_DATA"]:
            # call 'transmit data' logic
            pass
        elif cmd_id == cmd_prot["UINT16_T__TERM_ON_REQUEST_PORTS"]:
            # call 'return available ports' logic
            pass
        else:
            print("not a valid frontend message")
        
        if msg == b"start ser":
            try:
                self.SerialServer.create_serial_connection()
            except SerialException:
                connect_failure = f"""cannot connect to
                port:     {self.SerialServer.virtual_port}
                baudrate: {self.SerialServer.baud_rate}
                bytesize: {self.SerialServer.byte_size}
                parity:   {self.SerialServer.parity}
                timeout:  {self.SerialServer.timeout}
                hint: check device properly connected"""
                for line in connect_failure.split('\n'):
                    print(line)
                self.TCPServer.write_to_client(bytes(connect_failure, "utf-8"))
                
        elif msg == b"sendser":
            self.SerialServer.write_to_serial(msg)
        elif msg == b"EXIT":
            print("SerialTerminalServer exiting")
            self.TCPServer.write_to_client(b"EXIT")
            time.sleep(5)
            self.close()
            print("SerialTerminal exited")
        else:
            self.TCPServer.write_to_client(b"'" + bytes(msg) + b"'" + b" is not a valid command!")

    def close(self):
        self.TCPServer.close()
        self.SerialServer.close()
        return 0

if __name__ == "__main__":
    s = TerminalServer()
    s.activate()
