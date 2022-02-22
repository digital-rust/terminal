#!/usr/bin/env python3

from enum import Enum
import time
import platform
from serial.serialutil import SerialException
from terminal.serial_server import SerialServer
from terminal.TCP_server import TCPServer

class message_protocol(Enum):
    """
        # [bytearray[uint16 CmdType][unspec Msg]]
    """

    UINT16_T__TERM_ON_COM_CONNECT             = b'00',
    UINT16_T__TERM_ON_PORT_DISCONNECT         = b'01',
    UINT16_T__TERM_ON_PORT_REFRESH            = b'02',
    UINT16_T__TERM_ON_BAUDRATE_CHANGE         = b'03',
    UINT16_T__TERM_ON_TRANSMIT_DATA           = b'04',
    UINT16_T__TERM_ON_REQUEST_PORTS           = b'05'
    UINT16_T__TERM_ON_SHUTDOWN                = b'06'

class TerminalServer():

    def __init__(self):
        #default args just set for now to make my life easier
        self.working_machine = platform.system()
        self.TCPServer = TCPServer()
        self.SerialServer = SerialServer()
        self.set_default_TCP()
        self.__RUN = True

    def set_default_TCP(self):
        TCP_HOST = '127.0.0.1'
        TCP_PORT = 5651
        self.TCPServer.Host = TCP_HOST
        self.TCPServer.Port = TCP_PORT
        
    def activate(self):
        # Main loop of program
        with self.TCPServer as FRONTEND:
            with self.SerialServer as RS232:
                while self.__RUN:
                    time.sleep(0.1)    
                    # Client Logic
                    data = FRONTEND.read_from_client()
                    if(data == -1):
                        pass
                    else:
                        data = self.parse_client_message(data) #parse msg
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
        
        # check legacy_parser for example on how to iteratively index a dict
        if cmd_id == message_protocol.UINT16_T__TERM_ON_COM_CONNECT:
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
        elif cmd_id == message_protocol.UINT16_T__TERM_ON_PORT_DISCONNECT:
            # call 'disconnect from port' logic
            pass
        elif cmd_id == message_protocol.UINT16_T__TERM_ON_PORT_REFRESH:
            # call 'port refresh' logic
            pass
        elif cmd_id == message_protocol.UINT16_T__TERM_ON_BAUDRATE_CHANGE:
            # call 'br change' logic
            pass
        elif cmd_id == message_protocol.UINT16_T__TERM_ON_TRANSMIT_DATA:
            self.SerialServer.write_to_serial(msg)
            pass
        elif cmd_id == message_protocol.UINT16_T__TERM_ON_REQUEST_PORTS:
            # call 'return available ports' logic
            pass
        elif cmd_id == message_protocol.UINT16_T__TERM_ON_SHUTDOWN:
            print("SerialTerminalServer exiting")
            self.close()
            print("SerialTerminal exited")
        else:
            self.TCPServer.write_to_client(b"'" + bytes(msg) + b"'" + b" is not a valid command!")

    def close(self):
        self.__RUN = False # Since other two are in context blocks should automatically be closed by with statement
        return 0

if __name__ == "__main__":
    s = TerminalServer()
    s.activate()