#!/usr/bin/env python3

import time
import platform
from serial.serialutil import SerialException
from SerialServer import SerialServer
from TCPServer import TCPServer

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
        # TODO: 
        # Frontend<>Backend messaging prot
        # [[uint16 CmdType] [unspec Msg]]

        if msg == b"start ser":
            try:
                self.SerialServer.create_serial_connection()
            except SerialException:
                connect_failure = f"""cannot connect to
                port: {self.SerialServer.virtual_port}
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