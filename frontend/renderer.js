// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const network = require('./network.js'); 
const backend_addr = '127.0.0.1';
const backend_port = 5651;

const refresh = document.getElementById('refresh_com_port');
const connect = document.getElementById('connect_com_port');
const send = document.getElementById('send_data');
var receive = document.getElementById("queryText");

// instantiate a TCP client for the session
var client = createBridge();

// keep listening
onRx(); //
// try to remove this dependancy
// separate function for this in network.js
// not really needed for this

// load available ports
loadPorts();










refresh.addEventListener('click', function() {
    console.log('REFRESHING..\n'); // Refresh available virtual ports
});

connect.addEventListener('click', function() {
    console.log('CONNECTING..\n todo: connect functionality'); // Connect to virtual COM port
});

send.addEventListener('click', function() {
    var user_data = document.getElementById('data_tx').value; // get data from text box
    client.onData(user_data); // Send data over RS232 [utf-8 encoding by default]
});

async function onRx() {
    client.onRxData(receive);
}

function loadPorts() {
    // looks for ports on the system (handled in backend)

}

function createBridge() {
    return new network.Bridge(backend_addr, backend_port);
}

function loadPorts() {
    // send message based on msg prot to load up
    // define custom msg
    var ReqPortsPending = 'list_ports';
    client.onData(ReqPortsPending);
}

var largeRows = "20";
var largeCols = "100";
var normalRows = receive.rows;
var normalCols = receive.cols;

// deprecate this by dynamically resizeable box
document.getElementById("queryText_sz").onclick = function()
{
    if(this.innerHTML == "+") {
        receive.rows = largeRows;
        receive.cols = largeCols;
        this.innerHTML = "-"
    } else {
        receive.rows = normalRows;
        receive.cols = normalCols;
        this.innerHTML = "+"
    }
}
