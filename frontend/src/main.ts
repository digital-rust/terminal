// MAIN PROC
// Modules to control application life and create native browser window
import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";
import { execFile } from "child_process";

function createMenu(): void {
    const template = [
        { label: app.name,
                    submenu: [
                        {label:'exit'},
                        {label:'preferences'},
                    ]},

        {label:'view',
                    submenu: [
                        {label: 'a'},
                        {label: 'b'},
                    ]},

        {label:'help',
                    submenu: [
                        {label: 'a'},
                        {label: 'b'},
                    ]}
    ]; 

    // custom menu call and set as default menu
    const mainMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(mainMenu);
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

    // load the index.html of the app
    mainWindow.loadFile(path.join(__dirname, 'index.html'))

    // initialize python backend
    // TODO check for open TCP port and pass that as arg to backend so it loads up on it and then connect
    const opt = () => {
        execFile(path.join(__dirname,'dist/fordist.app/Contents/MacOS/fordist'), function (err, data) {
            console.log(err);
            console.log(data.toString());
        });
    }
    opt();

    // open devtools
    mainWindow.webContents.openDevTools()
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
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
