const { app, BrowserWindow } = require('electron')

// include the Node.js 'path' moduel at the top of your file
const path = require('path')

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
            nodeIntegration: true,
		}
	})

	mainWindow.loadFile(path.join(__dirname, 'index.html'))

    // open dev tools
    mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})


