// This file handles all networking frontend <-> backend

var net = require('net');

var client;
class Bridge {

    constructor(host, port) {
        this.host = host;
        this.port = port;

        client = new net.Socket();
        
        try {
            client.connect({
                port: this.port,
                host: this.host
            });
        } catch (error) {
            console.log('bridge to backend node could not be built', error);
        }
        this.onConnect();
    }
    
    onConnect() {
        client.on('connect',function(){
            console.log('--------------client details -----------------');
            var address = client.address();
            var port = address.port;
            var family = address.family;
            var ipaddr = address.address;
            console.log(`electron attached on${port} at ${ipaddr} as ${family}`);
        });

        client.on('drain', function(){
            console.log("DRAIN");
        });

        this.setEncoding();

        client.on('end', function(){
            console.log("END");
        });
    }

    onRxData(input_element) {
        client.on('data', function(rx_data) {

            // frontend parsing logic here
            // e.g. python returning list with available serial ports

            // buffer this so if rx_data > 100
            // pop the last received element
            // better to be user adjustable
            // https://nodejs.org/api/buffer.html
            console.log('received', rx_data);
            input_element.value += rx_data;
        });
    }

    setEncoding() {
        //console.log("setEncoding");
        client.setEncoding('utf8');
    }

    onData(data) {
        // attempt data transfer
        if (client.writable) {
            try {
                client.write(data);
            } catch (error) {
                console.error('could not transfer data to backend node', error);
            } finally {
                var d_sz = data.length;
                var d = client.bytesWritten;
                console.log(`ib[${d_sz}] > d[${d}]`);
            }
        } else {
            throw 'bridge to backend node is not built.'
        }
    }

    end() {
        client.destroy();
    }

    close() {
        client.close();
    }
}

module.exports = {
    Bridge
}
