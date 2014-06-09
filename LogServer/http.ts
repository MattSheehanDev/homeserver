
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

            //this.mime = {
            //    "html": "text/html",
            //    "css": "text/css",
            //    "js": "application/javascript",
            //    "png": "image/png",
            //    "svg": "image/svg+xml",
            //};

        }


        public parse(req: net.ServerRequest) {
            var cmd: any;
            var u = url.parse(req.url);

            if (req.method == "GET") {
                var parsed: any = this.parseObjId(u.pathname);
                cmd = new command.network.getCommand(parsed.obj, parsed.id);
                req.emit("command", cmd);

                //if (u.pathname == "/") {
                //    u.pathname = "views/index.html";
                //}

                //var ext = path.extname(u.pathname);
                //if (ext != "") {
                //    var mime = this.mime[ext.split(".")[1]];
                //    var dir = path.join(process.cwd(), "/portal/");
                //    var file = path.join(dir, u.pathname);
                //    cmd = new command.network.pageCommand(mime, file);
                //    req.emit("command", cmd);
                //}
                //else {
                //    var parsed: any = this.parseObjId(u.pathname);
                //    cmd = new command.network.getCommand(parsed.obj, parsed.id);
                //    req.emit("command", cmd);
                //}
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