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
portfinder.basePort = 8000;    // default: 8000
portfinder.highestPort = 65535; // default: 65535

// eslint-disable-next-line @typescript-eslint/no-var-requires
const portastic = require('portastic');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcRenderer } = require('electron');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defs = require('../build/ipc_defs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const net = require('net');

// HTML Elements
const refresh   = document.getElementById("refresh_com_port");                // 'REFRESH' button
const connect   = document.getElementById("connect_com_port");                // 'CONNECT' button
const send      = document.getElementById("send_data");                       // 'SEND' data button
const receive   = document.getElementById("queryText");                       // 'RECEIVE' data box
const user_data = document.getElementById("data_tx") as HTMLInputElement;

// Global Renderer Events
ipcRenderer.on(defs.BCKEND_SHUTDOWN_ONAPP_QUIT, shutdown);

// Backend Bridge
let client = createBridge();
initBridge(client);
connectBridge(client);

onRx(client);       // check for received data
loadPorts(client);  // load available ports

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

async function getPortFree() {
    return new Promise( res => {
        const srv = net.createServer();
        srv.listen(0, () => {
            const port = srv.address().port
            srv.close((err) => res(port))
        });
    })
}

async function initBridge(client) {

    // test manual 'net' port by probe binding
    const PORT = await getPortFree();
    console.log('free port is > ' + PORT);
    ipcRenderer.send(defs.BCKEND_SPWN_TCPPORT_CHANNEL, PORT);

    ipcRenderer.on(defs.BCKEND_SPWN_TCPPORT_CHANNEL, (event, arg) => {
        client.initHost('127.0.0.1');
        client.initPort(PORT);
        console.log(`BACKEND IS INDEED INITIALIZED AND NOW WE CONNECT TO IT${PORT}`)
    })}

    // test portastic
    // portastic.find({
    //     min: 8001,
    //     max: 8080,
    //     retrieve: 1,
    // })
    // .then(function(port){
    //     console.log('free port is > ' + port[0]);
    //     ipcRenderer.send(defs.BCKEND_SPWN_TCPPORT_CHANNEL, port[0]);

    //     ipcRenderer.on(defs.BCKEND_SPWN_TCPPORT_CHANNEL, (event, arg) => {
    //         client.initHost('127.0.0.1');
    //         client.initPort(port[0]);
    //         console.log(`BACKEND IS INDEED INITIALIZED AND NOW WE CONNECT TO IT${port}`)

    //     })})

    // test portfinder
    // portfinder.getPortPromise().then((port) => {
    //     ipcRenderer.send(defs.BCKEND_SPWN_TCPPORT_CHANNEL, port);

    //     ipcRenderer.on(defs.BCKEND_SPWN_TCPPORT_CHANNEL, (event, arg) => {
    //         client.initHost('127.0.0.1');
    //         client.initPort(port);
    //         console.log(`BACKEND IS INDEED INITIALIZED AND NOW WE CONNECT TO IT${port}`)
    //         connectBridge(client);
    //     });
    // }).catch((err) => {
    //     console.error(err);
    // });
    //}

/* exposes available virtual ports */
function loadPorts(client: { onData: (arg0: string) => void; }): void {
    const ReqPortsPending = '05';
    //client.onData(ReqPortsPending);
}

async function shutdown() {
    await client.onData('00'); // hardcoded, swap it with the cmd from the interface definition
    await sleep(800);          // sleeps must be removed and instead block (await) where synchronicity is required
    client = null;
    ipcRenderer.send('closed'); // add to ipc_defs.ts
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function connectBridge(client) {
    await sleep(800);
    client.initConnect();
}
