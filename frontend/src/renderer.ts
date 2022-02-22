// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Bridge = require('../build/network');

// HTML Elements
const refresh = document.getElementById("refresh_com_port");
const connect = document.getElementById("connect_com_port");
const send = document.getElementById("send_data");
const receive = document.getElementById("queryText");
const user_data = document.getElementById("data_tx") as HTMLInputElement;

// instantiate a TCP client for the session [LEGACY]
const client = createBridge();

onRx(client);

// load available ports
loadPorts(client);

refresh.addEventListener('click', () => {console.log('TODO: refresh available com port\n');});
connect.addEventListener('click', () => {console.log('TODO: connect to com port\n');});
send.addEventListener('click', () => client.onData(user_data.value));

// not sure if needs be async
async function onRx(client: { onRxData: (arg0: HTMLElement) => void; }): Promise<void>{
    client.onRxData(receive);
}

function createBridge() {
    const backend_addr = '127.0.0.1';
    const backend_port = 5651;
    const client = new Bridge.Bridge({ host: backend_addr, port: backend_port })
    return client;
}

function loadPorts(client: { onData: (arg0: string) => void; }): void {
    const ReqPortsPending = '05';
    client.onData(ReqPortsPending);
}
