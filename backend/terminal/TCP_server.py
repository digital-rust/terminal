import socket
import time
from collections import deque
from threading import Thread, Event

class TCPServer():

    def __init__(self, Host = None, Port = None):
        # Host: Standard loopback interface address (localhost)
        # Port: port to listen on (non-privileged ports are > 1023)
        self.Host, self.Port = Host, Port
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # Needs to be destroyed appropriately
        self.__WRITE = Event()
        self.__EXIT_THREADS = Event()
        self.__EXIT_THREADS.set() #Set to true
        self.__ReadList = deque() # Linked list, behaves similarly but more performant for this purpose
        self.__WriteList = deque()
        self.__reader_thread, self.__writer_thread = Thread(target=self.__start_reader_thread), Thread(target=self.__start_writer_thread)

    def start(self):
        self.socket.bind((self.Host, self.Port))
        self.socket.listen(1) # Max 1 connection anyway
        self.conn, self.addr = self.socket.accept() # conn also needs to be destroyed appropriately
        self.__thread_starter()

    def __thread_starter(self):
        self.__ReadList = deque() # Linked list, behaves similarly but more performant for this purpose
        self.__WriteList = deque()
        self.__reader_thread.start()
        self.__writer_thread.start()

    def __start_reader_thread(self):
        print("TCP Reader Thread Started")
        while(self.__EXIT_THREADS.is_set()):
            data = self.conn.recv(1024)
            self.__ReadList.append(data)
            time.sleep(0.1) # Essentially yields to any other threads
        print("TCP Reader thread ended")

    def __start_writer_thread(self):
        print("TCP Writer Thread Started")
        count = 0
        while(self.__EXIT_THREADS.is_set()):
            if(count >= 1):
                count = 0 # count is merely to ensure all write orders are processed before clearing __WRITE
                self.__WRITE.clear() # Clears flag so it waits again
            if(self.__WRITE.wait(1.) == False):
                continue # Waits on __WRITE becoming true for a second, then repeats
                # This is to allow a kill order to actually work rather than potentially block 
                # forever because nothing is ever written. 
            try:
                data = self.__WriteList.popleft() # popleft So that it acts as a FIFO, not LIFO
                if len(data) > 0:
                    print(f"TCPServer is writing: {data}")
                    self.conn.sendall(data) 
                    print(f"TCPServer successfully wrote: {data}")
            except IndexError:
                count += 1
        print("TCP Writer thread ended")

    # __enter__ and __exit__ together allow for use with context manager 'with'.
    def __enter__(self):
        self.start()
        return self

    def __exit__(self, type, value, traceback):
        self.close()

    def read_from_client(self):
        #recv 1024 bytes
        try:
            data = self.__ReadList.popleft() # popleft so that it acts as a FIFO, not LIFO
            return data
            
        except IndexError:
            return -1 # No data to read

    def write_to_client(self, data):
        #sendall attempts to resend until message has been successfully received
        self.__WriteList.append(data)
        self.__WRITE.set()
        return 0

    def close(self):
        #Needs to happen before closing conn so there's no exception
        self.__EXIT_THREADS.clear() #Sets to false, threads should exit
        self.__reader_thread.join()
        self.__writer_thread.join()

        self.conn.close()
        self.socket.close()
        print("TCPServer successfully exited")
