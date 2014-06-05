
import net = require("http");

//var port = process.env.port || 1337;

//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end('Hello World\n');
//}).listen(port);



export module network {


    export class http {

        public server: net.Server;
        public port: number;
        public ip: string;

        constructor(json: any) {

            if (json.address) {

                var address: string = json.address;
                var parts = address.split(":");

                this.ip = parts[0];
                this.port = parseInt(parts[1]);
            }
            else {
                this.port = 8080;
            }

        }


        public run(onHttp: (req: net.ServerRequest, res: net.ServerResponse) => void) {

            this.server = net.createServer(onHttp);
            this.server.listen(this.port, this.ip);
        }

    }

}