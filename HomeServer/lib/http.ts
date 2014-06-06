
/// <reference path="commands.ts" />

import command = require("./commands");


import net = require("http");
import url = require("url");
import path = require("path");



export module network {


    export class http {

        public server: net.Server;
        public port: number;
        public ip: string;

        public mime: any;

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

            this.mime = {
                "html": "text/html",
                "css": "text/css",
                "js": "application/javascript",
            };

        }


        public parse(req: net.ServerRequest): command.network.command {
            var cmd: command.network.command;
            var u = url.parse(req.url);

            if (req.method == "GET") {
                if (u.pathname == "/") {
                    u.pathname = "index.html";
                }

                var ext = path.extname(u.pathname);
                if (ext != "") {
                    var mime = this.mime[ext.split(".")[1]];
                    var dir = path.join(process.cwd(), "/portal");
                    var file = path.join(dir, u.pathname);
                    cmd = new command.network.pageCommand(mime, file);
                }
                else {
                    if (u.pathname.charAt(0) == "/") {
                        u.pathname = u.pathname.slice(1, u.pathname.length);
                    }
                    if (u.pathname.charAt(u.pathname.length - 1) != "/") {
                        u.pathname += "/";
                    }

                    var parts = u.pathname.split("/");

                    var obj = parts[0];
                    var id = parts[1];

                    cmd = new command.network.getCommand(obj, id);
                }
            }

            return cmd;
        }

        public run(onHttp: (req: net.ServerRequest, res: net.ServerResponse) => void) {

            this.server = net.createServer(onHttp);
            this.server.listen(this.port, this.ip);
        }

    }

}