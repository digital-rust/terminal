// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Bridge = require('../build/network');

/* interface definition | note: this can be refactored to instead parse the toml definition file*/
enum Interface {
    SHUTDOWN        = 0,
    POLL_PORTS      = 1,
    CONNECT         = 2,
    DISCONNECT      = 3,
    SEND            = 4,
    SET_BAUD_RATE   = 5,
}

// HTML Elements
const refresh   = document.getElementById("refresh_com_port");                // 'REFRESH' button
const connect   = document.getElementById("connect_com_port");                // 'CONNECT' button
const send      = document.getElementById("send_data");                       // 'SEND' data button
const receive   = document.getElementById("queryText");                       // 'RECEIVE' data box
const user_data = document.getElementById("data_tx") as HTMLInputElement;     // 'SEND' data input box
const client    = createBridge();                                             // instantiate interface bridge

onRx(client);       // check for received data
loadPorts(client);  // load available ports

refresh.addEventListener('click', (): void => {
    // cmd_id from messaging prot + appendage
    console.log('TODO: refresh available com port\n');
});
connect.addEventListener('click', (): void => {
    // cmd_id from messaging prot + appendage
    console.log('TODO: connect to com port\n');
});
send.addEventListener('click', (): void => {
    // cmd_id from messaging prot + appendage
    return client.onData(user_data.value);
}); // only need to listen for this event in case 'connected'!

/* 'listens' for incoming data */
async function onRx(client: { onRxData: (arg0: HTMLElement) => void; }): Promise<void>{
    client.onRxData(receive);}

/* constructs an interface bridge */
function createBridge() {
    const backend_addr = '127.0.0.1';
    const backend_port = 5651;
    const client = new Bridge.Bridge({ host: backend_addr, port: backend_port })
    return client;
}

/* exposes available virtual ports */
function loadPorts(client: { onData: (arg0: string) => void; }): void {
    const ReqPortsPending = '05';
    //client.onData(ReqPortsPending);
}
