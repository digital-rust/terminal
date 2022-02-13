

from sys import argv
from os import getcwd
from os.path import join



def start_server():
    from terminal.terminal_server import TerminalServer
    s = TerminalServer()
    s.activate()

def parse_arg(arg):
    if(arg.lower() == "y"):
        return 1
    elif(arg.lower() == "n"):
        return 0
    else:
        raise ValueError("Can only use values y or n.")

if __name__ == "__main__":
    """Merely Calls TerminalServer which is the entry point into the server"""
    print(argv)
    run_tests = None
    run_server = None


    if(len(argv) == 1):
        run_tests = 1 # 1 to run, 0 not to run
        run_server = -1 # -1 to ask, 0 to not run, 1 to run
    elif(len(argv) == 2 or len(argv) > 3):
        #Remember script name is one arg
        raise ValueError("Must be started with two args with y(Yes) or n(No). With format [[$run_tests], [$run_server]]")
    else:
        run_tests = parse_arg(argv[1])
        run_server = parse_arg(argv[2])


    if(run_tests == 1): # 1 for run tests
        import pytest
        # To get around pytest issue where it doesn't work correctly if I use multiple argvs
        path = getcwd()
        path = join(path, "tests")
        pytest.main([path])
    elif(run_tests == 0):
        print("Skipping tests")
    else: 
        raise ValueError(f"run_tests must be 0 or 1 not {run_tests}")
    
    
    if(run_server == -1):
        run_server = input("Startup server y/n? ")
        if(run_server.lower() == "y"):
            start_server()
        elif(run_server.lower() == "n"):
            print("Finished")
        else:
            print("Invalid command: You must enter y or n.")
            input("Startup server y/n? ")
    elif(run_server == 0):
        print("Finished")
    elif(run_server == 1):
        start_server()
    else:
        raise ValueError(f"run_server must be -1,0 or 1 not {run_server}")
    