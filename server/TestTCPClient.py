#!/usr/bin/env python3

import sys
from collections import deque
import time
from threading import Thread, Event
import socket

class TCPClient():

    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.read_list = deque()
        self.__EXIT_THREADS = Event()
        self.__EXIT_THREADS.set()
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.__reader__thread = Thread(target = self.__reader_thread)

        self.__reader2__thread = Thread(target = self.__reader_thread2)
        
    def __reader_thread(self):
        # Reads from command line
        while self.__EXIT_THREADS:
            time.sleep(0.1)
            msg = ""
            while self.__EXIT_THREADS:
                time.sleep(0.1)
                char = sys.stdin.read(1)
                if(char == "\n"):
                    break
                msg += char
            self.read_list.append(msg)
        print("Client: ReaderThread exited")

    def __reader_thread2(self):
        while self.__EXIT_THREADS:
            time.sleep(0.1)
            data = self.socket.recv(1024) 
            if data == b'EXIT':
                break
            elif data == b'':
                continue
            else:
                print(f"Receiving: {data.decode('UTF-8')}")
        print("Client: ReaderThread2 exited")

    def __enter__(self):
        self.socket.connect((HOST, PORT))
        self.__reader__thread.start()
        self.__reader2__thread.start()
        while True:
            time.sleep(0.1)
            try:
                usr_input = self.read_list.pop()
                print(f"Writing: {usr_input}")
                if(usr_input == "EXIT"):
                    self.socket.sendall(bytearray(usr_input, "utf-8"))
                    self.__EXIT_THREADS.clear()
                    break
                self.socket.sendall(bytearray(usr_input, "utf-8"))
            except IndexError:
                time.sleep(0)

    def __exit__(self, type, value, traceback):
        self.socket.close()
        self.__reader_thread.join()
        self.__reader_thread2.join()



if __name__ == "__main__":
    HOST = '127.0.0.1'  # The server's hostname or IP address
    PORT = 5651      # The port used by the server
    with TCPClient(HOST, PORT) as s:
        pass
