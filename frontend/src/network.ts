// interface module (transparent to messaging protocol)

import net = require("net");
import { Buffer } from 'buffer';

class Bridge {
    host: string;
    port: number;
    client: net.Socket;

    /* construct socket*/
    constructor() {
        this.client = new net.Socket();
    }

    // init socket host
    initHost(host: string): void {
        console.log('initing host ' + host)
        this.host = host;
        console.log(this.host)
    }
    // init socket port
    initPort(port: number): void {
        console.log('initing port ' + port)
        this.port = port;
        console.log(this.port)
    }

    // init connection
    initConnect(client: net.Socket): void {
        try {
            this.client.connect({
                port: this.port,
                host: this.host
            });
        } catch (error) {
            console.log('bridge to backend node could not be built', error);
        }
        this.onConnect(this.client);
    }

    /* display bridge metadata */
    onConnect(client: net.Socket): void {
        client.on('connect',(): void => {
                const port = client.localPort;
                const family = client.remoteFamily;
                const ipaddr = client.localAddress;
                console.log(`bridge: \non ${port} \nat ${ipaddr} \nas ${family}.`);
            });

        client.on('drain', (): void => {
                console.log("Empty write buffer.");
            });
        
        /* sets encoding for data readable from stream */
        this.setEncoding();

        client.on('end', (): void => {
                console.log("Bridge destroyed.");
            });
    }

    /* callback on received data */
    onRxData(input_element: HTMLInputElement): void {
        this.client.on('data', (rx_data): void => {
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

    setEncoding(): void {
        this.client.setEncoding('utf8');
    }

    /* callback on sent data */
    onData(data: string): void {

        // attempt data transfer
        if (this.client.writable) {
            try {
                const databuf = Buffer.from(data, 'utf-8');
                this.client.write(databuf);
            } catch (error) {
                console.error('could not transfer data to backend node', error);
            } finally {
                const d_sz = (data).length;
                const d = this.client.bytesWritten;
                console.log(`ib[${d_sz}] > d[${d}]`);
            }
        } else {
            throw 'bridge to backend node is not built.'
        }
    }

    end(): void {
        this.client.destroy();
    }

    close(): void {
        this.client.end();
    }
}

export {Bridge};
