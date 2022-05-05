import { app, BrowserWindow, Menu, ipcMain } from "electron";
import * as path from "path";
import { execFile } from "child_process";
import * as defs from "../build/ipc_defs"

// GLOBALS
const PIDArray = [];        // general array containing spawned processes IDs
let state = 0;              // initial app state
enum State {                // state struct
    ON             = 0,
    SHUTTING_DOWN  = 1
}

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
    const portStr = port.toString();
    console.log(path.join(__dirname, 'dist/fordist.app/Contents/MacOS/fordist' + portStr));

    const fh = execFile(path.join(__dirname, 'dist/fordist.app/Contents/MacOS/fordist'), [portStr], function (error, stdout, stderr) {
        if (error) {
            console.log(error);
        }
        console.log(stdout);
        console.log(stderr);
    });
    PIDArray.push(fh.pid) // keep track of the child proc ID to kill it on quit
    return fh;
}

function createWindow (): void {const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
        devTools: true, // disable for pre-production and release
        nodeIntegration: true,
        contextIsolation: false,
        preload: path.join(__dirname, './preload.js')
    }
  })
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    ipcMain.on(defs.BCKEND_SPWN_TCPPORT_CHANNEL, (event, arg) => {
        console.log(`received free TCP port from renderer proc ${arg}`);
        backendHandler(arg);
        event.reply(defs.BCKEND_SPWN_TCPPORT_CHANNEL ,'backend is initialized')
    })
    mainWindow.webContents.openDevTools(); // disable for pre-production and release

    // Continue to handle mainWindow "close" event here
    mainWindow.on('close', function(event){
        console.log('window-close event is triggered');
        if (state == State.ON) {
            if (mainWindow) {
                event.preventDefault();
                mainWindow.webContents.send(defs.BCKEND_SHUTDOWN_ONAPP_QUIT);
                mainWindow.close;
            }
        }
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
    console.log('window-all-closed event is triggered');
  //if (process.platform !== 'darwin') {


    //PIDArray.forEach(function(proc) {
    //    proc.kill();
    //});
    //app.quit(); // shutdown app as all windows closed even on macOS for now
  //}
  // shutdown backend before quitting the application
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
ipcMain.on('closed', _ => {
    state = State.SHUTTING_DOWN;
    app.quit();
})