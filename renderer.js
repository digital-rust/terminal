// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// Process buttons - todo: link with main process https://www.youtube.com/watch?v=rX3axskesDw&ab_channel=Codevolution
// Refresh available virtual ports
const COM_refreshBtn = document.getElementById('refres_com_port');
COM_refreshBtn.addEventListener('click', function() {
    console.log('REFRESHING..\n todo: refresh functionality');
});

// Connect to virtual COM port
const COM_connect = document.getElementById('connect_com_port');
COM_connect.addEventListener('click', function() {
    console.log('CONNECTING..\n todo: connect functionality');
});

// Send data over RS232
const DATA_rs232_tx = document.getElementById('send_data');
DATA_rs232_tx.addEventListener('click', function() {
    console.log('SENDING..\n todo: send functionality');
});

var textarea = document.getElementById("queryText");
var largeRows = "20";
var largeCols = "100";
var normalRows = textarea.rows;
var normalCols = textarea.cols;

document.getElementById("queryText_sz").onclick = function()
{
    if(this.innerHTML == "+") {
        textarea.rows = largeRows;
        textarea.cols = largeCols;
        this.innerHTML = "-"
    } else {
        textarea.rows = normalRows;
        textarea.cols = normalCols;
        this.innerHTML = "+"
    }
}
