// MAIN PROC
// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path');

// NETWORK
const zmq = require('zeromq');
const sock = new zmq.Socket('pair')
const backend_addr = 'tcp://127.0.0.1:5651'

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // this is the logic that should happen
  // for textbox content to be sent
  // when button 'send' is pressed
  // put this somewhere else, not in main
  // ideally, a whole folder would be
  // dedicated to the client comms
  // data from the render to the main
  // shall be passed and processed in that folder.
  // those other js files will be referenced using <script>
  // in index.html (single-page)
  //SEPARATES FRONTEND<->BACKEND LOGIC
  //FROM THE ACTUAL DESIGN
  async function runClient() {
      console.log('connecting to back node at: [', backend_addr,']');
      sock.connect(backend_addr);
      console.log('connected to back node at: [', backend_addr, ']');
  
      // simulate connect button click
      var connectBtn_Onclick = false;
      console.log(connectBtn_Onclick)
      setTimeout(function() {ConnectBtnClick(connectBtn_Onclick);}, 2000);
    }  
    runClient();
  async function ConnectBtnClick(connectbutton) {
      connectbutton = true;
      console.log(connectbutton);
  
      if (connectbutton) {
          console.log('connect was clicked..');
          sock.send('start ser');
          buf_srx = sock.on('message', function(msg) {
              console.log('rx <-', msg.toString());
              })
      };
      }

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
