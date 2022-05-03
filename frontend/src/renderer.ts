// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Bridge = require('../build/network');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const portfinder = require('portfinder');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcRenderer } = require('electron');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defs = require('../build/ipc_defs')

// HTML Elements
const refresh   = document.getElementById("refresh_com_port");                // 'REFRESH' button
const connect   = document.getElementById("connect_com_port");                // 'CONNECT' button
const send      = document.getElementById("send_data");                       // 'SEND' data button
const receive   = document.getElementById("queryText");                       // 'RECEIVE' data box
const user_data = document.getElementById("data_tx") as HTMLInputElement;
   
const client = createBridge();
initBridge(client);

onRx(client);       // check for received data
loadPorts(client);  // load available ports
endSessionKillBackend();
refresh.addEventListener('click', (): void => {
    console.log('TODO: refresh available com port\n');
});
connect.addEventListener('click', (): void => {
    console.log('TODO: connect to com port\n');
});
send.addEventListener('click', (): void => {
    return client.onData(user_data.value);
}); // only need to listen for this event in case 'connected'!

/* 'listens' for incoming data */
async function onRx(client: { onRxData: (arg0: HTMLElement) => void; }): Promise<void>{
    client.onRxData(receive);}

/* constructs an interface bridge */
function createBridge() {
    const client = new Bridge.Bridge();
    return client;
}

function initBridge(client) { 
    // find a free TCP port
    portfinder.getPort(function (err, port) {
        client.initHost('127.0.0.1');
        client.initPort(port);
        ipcRenderer.send(defs.BCKEND_SPWN_TCPPORT_CHANNEL, port);
        client.initConnect();
    })
}

function endSessionKillBackend() {
    // 1. ipc receive kill backend channel
    // 2. send the shutdown command to the backend
    ipcRenderer.on(defs.BCKEND_SHUTDOWN_ONAPP_QUIT, shutdown);
}

/* exposes available virtual ports */
function loadPorts(client: { onData: (arg0: string) => void; }): void {
    const ReqPortsPending = '05';
    //client.onData(ReqPortsPending);
}

function shutdown() {
    console.log('closing backend msg from main')
    return client.onData('00'); //hardcoded, swap it with the cmd from the interface definition
}
