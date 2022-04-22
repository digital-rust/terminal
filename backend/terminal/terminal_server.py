#!/usr/bin/env python3

import time
import platform
from serial.serialutil import SerialException
from terminal.serial_server import SerialServer
from terminal.TCP_server import TCPServer
import terminal.interface as interface

class TerminalServer():

    def __init__(self):
        #default args just set for now to make my life easier
        self.working_machine = platform.system()
        self.TCPServer = TCPServer(*self.default_TCP())
        self.SerialServer = SerialServer(*self.default_Serial())
        self.__RUN = True

    def default_TCP(self):
        TCP_HOST = '127.0.0.1'
        TCP_PORT = 5651
        return TCP_HOST, TCP_PORT

    def default_Serial(self):
        virtual_port = '/dev/tty.usbmodem11101' #some tty
        baud_rate = 115200 
        byte_size = 8
        parity = 'N' 
        stop_bits = 1 
        timeout = 1
        return virtual_port, baud_rate, byte_size, parity, stop_bits, timeout

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
                        data = self.parse_client_message(data) #parse msg according to interface definition
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
                    else:
                        continue

    def parse_client_message(self, msg):
        
        #################################
        # msg -> [uint16_cmd_type][msg] #
        #################################
        
        # move below command_operation
        cmd_id   = msg[:2]                   # command id
        cmd_sz   = 2                         # command id size (bytes)

        # python's equivalent to a switch statement - the dictionary
        command_operation = {
            interface.def_interface['SHUTDOWN']['input']['CMD_ID']['value']: self.close,
            interface.def_interface['CONNECT']['input']['CMD_ID']['value'] : self.SerialServer.create_serial_connection,
            interface.def_interface['DISCONNECT']['input']['CMD_ID']['value']: self.SerialServer.close_serial_connection,
            interface.def_interface['SEND']['input']['CMD_ID']['value']: self.send_data(msg, cmd_sz),
        }

        try:
            if (int(cmd_id) >= 0) and (int(cmd_id) <= 10):
                operation = command_operation.get(int(cmd_id), lambda: self.default(msg))
                print(f'OPERATION: {operation}')
            else:
                self.TCPServer.write_to_client(b"'" + bytes(msg) + b"'" + b" is not a valid command!")
            if operation != None:
                operation()
        except:
            pass

    def send_data(self, msg, cmd_sz):
        print('sending data fro mthe function somehow')
        self.SerialServer.write_to_serial(msg[cmd_sz:])

    def close(self):
        self.__RUN = False # Since other two are in context blocks should automatically be closed by with statement
        return 0

if __name__ == "__main__":    
    s = TerminalServer()
    s.activate()
