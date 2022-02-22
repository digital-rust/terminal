<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href=""> <!--put logo here-->
    <!--<img src="images/logo.png" alt="Logo" width="80" height="80"> -->
  </a>

  <h3 align="center">terminal 0.0.3-a [pre-release]</h3>

  <p align="center">
    a simple serial terminal that simply doesn't suck
    <br />
    <a href="https://github.com/makaveevognyan/terminal/blob/main/README.md"><strong>docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/makaveevognyan/terminal/issues">report bug</a>
    ·
    <a href="https://github.com/makaveevognyan/terminal/issues">request feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>table of contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">intro</a>
      <ul>
        <li><a href="#built-with">built with</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">getting started</a>
      <ul>
        <li><a href="#prerequisites">prerequisites</a></li>
        <li><a href="#installation">installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">roadmap</a></li>
    <li><a href="#license">license</a></li>
    <li><a href="#contact">contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## about

<!--[![Product Name Screen Shot][product-screenshot]](https://example.com)-->

this is the "insert name here". there are many like it, but this one does not suck.

here is why [most are under dev]:
* nice ui
* no bugs
* nice, flexible logging
* allows flexible work with hw (can work with remote machines over TCP)

<p align="right">(<a href="#top">back ^</a>)</p>

### built with

* [Electron.js] (https://www.electronjs.org/)
* [Python] (https://www.python.org/)
* [pyserial]

<p align="right">(<a href="#top">back ^</a>)</p>


<!-- GETTING STARTED -->
## getting started

- get (latest nodejs & electronjs)
- run in a local folder: 
    ```
    npm init -y
    ```
- then replace all files with contents of /frontend;
- run:
    ```
    npm start
    ```

### prerequisites


<!-- ROADMAP -->
## roadmap

**Source code & App-related**
- [x] functional backend
- [x] some kind of frontend (functionality is todo)
- [x] hook up frontend to backend
  - [ ] clean up frontend code
  - [ ] create the "on-app-start" polling for available ports
- [ ] optimize CPU usage in TerminalServer/TCPServer
- [ ] fix issues with 'EXIT' to close TCPServer
- [ ] replace parse_messages with minimal msg protocol
- [ ] add unit tests
- [x] migrate frontend tcp handler from zmq to native node 'net' module
- [ ] TCP_server's __start_reader_thread() throws ConnectionResetError exception (line 34) when closing from frontend, needs to be captured and close server gracefully
- [ ] handle exception if frontend not able to connect to backend node
- [ ] handle exceptions if frontend msgs cannot be sent to backend node
- [ ] frameless window
- [ ] custom menu
- [x] upload pico test FW (/utils/)
- [x] migrate to TypeScript

miscellaneous
- [ ] establish main<->render IPC for full control (+flexible tracking/debugging via logs etc.) of internal messaging 
- [ ] consider small notification system (+enable/disable feature), notifying of app behaviour
- [ ] complete documenting 'Getting Started' w/ latest additions (TS, ESLint, etc..)

**roadmap for testing hardware**
- [ ] finalize & freeze communication testing over usb serial with RP2040 Rpi Pico
- [ ] develop same for UART to run via Rpi 4B
- [ ] turn Rpi 4B into webserver for remote connection to run tests
- [ ] scale that into Jenkins for CI/CD stuff
- [ ] write test suite
- [ ] develop comm. testing firmware for Pico over UART for USB<->RS232 Pico<->Rpi4B interface

**roadmap for the distant future**
- [ ] website
- [ ] docs on the website
- [ ] macros
- [ ] deci/hexa/octal system choices
- [ ] event on press 'ENTER' transmit to device
- [ ] little/big endianness options  


See the [open issues](https://github.com/makaveevognyan/terminal/issues) for a full list of proposed features (and known issues).

## license
todo

## contact
todo

<p align="right">(<a href="#top">back ^</a>)</p>
