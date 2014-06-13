
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
            var uri: url.Url = url.parse(req.url);

            if (req.method == "GET") {
                var parsed: any = this.parseObjId(uri);
                cmd = new command.network.getCommand(parsed.obj, parsed.id, parsed.params);
                req.emit("command", cmd);
            }
            else if (req.method == "POST") {
                var parsed: any = this.parseObjId(uri);
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

        public parseObjId(url: url.Url) {

            var path = url.pathname;
            if (path.charAt(0) == "/") {
                path = path.slice(1, path.length);
            }
            if (path.charAt(path.length - 1) != "/") {
                path += "/";
            }

            var parts = path.split("/");

            var obj = parts[0];
            var id = parts[1];

            var query = url.query;
            var params = query != "" ? qs.parse(query) : null;

            return { obj: obj, id: id, params: params };
        }

        public run(onHttp: (req: net.ServerRequest, res: net.ServerResponse) => void) {
            this.server = net.createServer(onHttp);
            this.server.listen(this.port, this.ip);
        }

    }

}