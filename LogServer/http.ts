
/// <reference path="commands.ts" />

import command = require("./commands");


import net = require("http");
import url = require("url");
import qs = require("querystring");
import path = require("path");



export module network {


    export class http {

        public server: net.Server;
        public port: number;
        public ip: string;

        public mime: any;

        constructor(config: any) {

            if (config.address) {

                var address: string = config.address;
                var parts = address.split(":");

                this.ip = parts[0] ? parts[0] : "localhost";
                this.port = parts[1] ? parseInt(parts[1]) : 4040;
            }
            else {
                this.ip = "localhost";
                this.port = 4040;
            }
        }


        public parse(req: net.ServerRequest) {
            var cmd: any;
            var u = url.parse(req.url);

            if (req.method == "GET") {
                var parsed: any = this.parseObjId(u.pathname);
                cmd = new command.network.getCommand(parsed.obj, parsed.id);
                req.emit("command", cmd);
            }
            else if (req.method == "POST") {
                var parsed: any = this.parseObjId(u.pathname);
                cmd = new command.network.postCommand(parsed.obj, parsed.id);

                req.on("data", function (data) {
                    var part = data.toString();
                    cmd.body += part;
                });

                req.on("end", function () {
                    cmd.params = qs.parse(cmd.body);
                    req.emit("command", cmd);
                });
            }
            else {
                req.emit("command", new command.network.errorCommand(500, "Invalid Command"));
            }
        }

        public parseObjId(str: string) {
            if (str.charAt(0) == "/") {
                str = str.slice(1, str.length);
            }
            if (str.charAt(str.length - 1) != "/") {
                str += "/";
            }

            var parts = str.split("/");

            var obj = parts[0];
            var id = parts[1];

            return { obj: obj, id: id };
        }

        public run(onHttp: (req: net.ServerRequest, res: net.ServerResponse) => void) {

            this.server = net.createServer(onHttp);
            this.server.listen(this.port, this.ip);
        }

    }

}