// MAIN PROC
// TODO: FIX THE GOD DAMN CLOSE EVENTS ON BOTH THE WINDOW AND THE APP APIS

import { app, BrowserWindow, Menu, ipcMain } from "electron";
import * as path from "path";
import { execFile } from "child_process";
import * as defs from "../build/ipc_defs"

const force_quit = false;

function createMenu(){
    // custom menu call and set as default menu
    // TODO: test accelerators + roles
    const mainMenu = Menu.buildFromTemplate( [
        {label: app.name,
                    submenu: [
                        {label:'preferences', accelerator:'CommandOrControl+I'}, //custom on click function execution
                        {label:'refresh', accelerator:'CommandOrControl+R', role:'reload'},
                        {label:'refresh_ignore_cache', accelerator:'CommandOrControl+F+R', role:'forceReload'},
                        {label:'quit', accelerator:'CommandOrControl+Q', role:'quit'},
                    ]},

        {label:'edit',
                    submenu: [
                        {label:'undo', accelerator:'CommandOrControl+Z', role:'undo'},
                        {label:'redo', accelerator:'CommandOrControl+Y', role:'redo'},
                    ]},

        {label:'view',
                    submenu: [
                        {label: 'minimize', accelerator:'CommandOrControl+-', role:'minimize'},
                    ]},

        {label:'help',
                    submenu: [
                        {label: 'info'}, // custom on click function execution (help information about the app)
                        {label: 'about', accelerator:'Shift+~', role:'about'},
                    ]}
    ]);
    Menu.setApplicationMenu(mainMenu);
}

function backendHandler(port) {
    const fh = execFile(path.join(__dirname, 'dist/fordist.app/Contents/MacOS/fordist'), function (err, data) {
        console.log(err);
        console.log(data.toString());
    });
    return fh;
}

function closeBackend(mainWindow: BrowserWindow) {
    // send a message to the renderer process to shutdown the backend ('00')
    mainWindow.webContents.send(defs.BCKEND_SHUTDOWN_ONAPP_QUIT, {'SAVED': 'File Saved'});
}

function createWindow (): void {
  // create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
        devTools: true,          // disable for pre-production and release
        nodeIntegration: true,
        contextIsolation: false,
        preload: path.join(__dirname, './preload.js')
    }
  })

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    ipcMain.on(defs.BCKEND_SPWN_TCPPORT_CHANNEL, (event, arg) => {
        console.log('received free TCP port from renderer proc ' + arg);
        const fh = backendHandler(arg);
    })

    mainWindow.webContents.openDevTools();

    // Continue to handle mainWindow "close" event here
    mainWindow.on('close', function(e){
        console.log('window-close event is triggered')
        //if(!force_quit){
        //    e.preventDefault();    
            // closeBackend(mainWindow); IPC to renderer to close
        //}
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // load custom native menu
    createMenu();
    createWindow();

  app.on('activate', function (): void {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function (): void {
  if (process.platform !== 'darwin') {
    app.quit(); // shutdown app as all windows closed even on macOS for now
  }
  // shutdown backend before quitting the application
  console.log('window-all-closed event is triggered');
})

// This is another place to handle events after all windows are closed
app.on('will-quit', function () {
    // This is a good place to add tests insuring the app is still
    // responsive and all windows are closed.
    console.log('will-quit event is triggered');
});

// You can use 'before-quit' instead of (or with) the close event
app.on('before-quit', function (e) {
    // Handle menu-item or keyboard shortcut quit here
    //if(!force_quit){
    //    e.preventDefault();
    //}
    console.log('before-quit event is triggered');
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
