import time
from collections import deque
import serial
from threading import Thread, Event


class SerialServer():

    def __init__(self):
        self.port = None
        self.baud_rate = None
        self.byte_size = None
        self.parity = None
        self.stop_bits = None
        self.timeout = None
        self.serial_connection = None

        self.__EXIT_THREADS = Event()
        self.__EXIT_THREADS.set() #Set to true
        self.__ReadList = deque() # Linked list, behaves similarly but more performant for this purpose
        self.__WriteList = deque()
        self.__reader_thread, self.__writer_thread = Thread(target=self.__start_reader_thread), Thread(target=self.__start_writer_thread)

        self.set_default_RS232()
    
    def create_serial_connection(self):
        self.serial_connection = serial.Serial(port=self.virtual_port,     \
                                                  baudrate=self.baud_rate, \
                                                  bytesize=self.byte_size, \
                                                  parity=self.parity,      \
                                                  timeout=self.timeout)
        self.__thread_starter()
    
    def close_serial_connection(self):
        self.serial_connection.close()
        self.serial_connection = None # So it's possible to see if nothing is connected
    
    def set_default_RS232(self):
        # Put defaults here
        # Seems pointless but we might have set to defaults
        # option for people. 
        self.virtual_port = '/dev/tty.usbmodem11101' #some tty
        self.baud_rate = 115200 
        self.byte_size = 8
        self.parity = 'N' 
        self.stop_bits = 1 
        self.timeout = 1

    def __thread_starter(self):
        self.__ReadList = deque() # Linked list, behaves similarly but more performant for this purpose
        self.__WriteList = deque()
        self.__reader_thread.start()
        self.__writer_thread.start()

    def __start_reader_thread(self):
        print("Serial Reader Thread Started")
        data = b''
        while(self.__EXIT_THREADS.is_set()):
            bytestoread = self.serial_connection.in_waiting
            
            if bytestoread > 0:
                data = self.serial_connection.read(bytestoread)
                
                self.__ReadList.append(data)
            time.sleep(0.1) # Essentially yields to any other threads
        print("Serial Reader thread ended")

    def __start_writer_thread(self):
        print("Serial Writer Thread started")
        while(self.__EXIT_THREADS.is_set()):
            try:
                data = self.__WriteList.popleft() # popleft So that it acts as a FIFO, not LIFO
                print(f"serial ser Attempting to write {data}")
                if(type(data) != bytes):
                    raise TypeError("You must write bytes to the serial")
                data = data + b'\r'
                total_to_write = len(data)
                total_written = self.serial_connection.write(data) # Returns bytes written
                print(f"serial total bytes written {total_written}")
                if(total_to_write != total_written):
                    raise Exception("Need to handle to write missing bytes in this case, left this for now")
                print(f"serial ser {data} was written successfully")
            except IndexError:
                time.sleep(0) #Lets other threads do something
        print("Serial Writer Thread ended")

    def __enter__(self):
        return self
    
    def __exit__(self, type, value, traceback):
        self.close()
    
    def close(self):
        try:
            self.serial_connection.close()
        except AttributeError as e:
            print("Attempted to close a non-existing connection", e)
            
    def write_to_serial(self, msg):
        self.__WriteList.append(msg)
        return 0

    def read_serial(self):
        if len(self.__ReadList) > 0:
            data = self.__ReadList.popleft() # popleft so that it acts as a FIFO, not LIFO
            return data

    def set_virtual_port(self, virtual_port):
        self.virtual_port = virtual_port

    def set_baud_rate(self, baud_rate):
        self.baud_rate = baud_rate

    def set_byte_size(self, byte_size):
        self.byte_size = byte_size

    def set_parity(self, parity):
        self.parity = parity

    def set_stop_bits(self, stop_bits):
        self.stop_bits = stop_bits

    def set_timeout(self, timeout):
        self.timeout = timeout
