
/// <reference path="http.ts" />

import http = require("./http");
import command = require("./commands");

import path = require("path");

//import event = require("events");



export module network {


    export class logger {

        private ip: string;
        private port: number;
        private path: string;

        constructor(config: any) {

            if (config.address) {

                var address: string = config.address;
                var parts = address.split(":");

                this.ip = parts[0] ? parts[0] : "localhost";
                this.port = parts[1] ? parseInt(parts[1]) : 4040;
            }
            else {
                this.ip = "localhost";
                this.port = 8080;
            }
        }


        public sendLog(cb: (code: number, msg: string) => void, qs: string) {
            var req = new http.network.httpRequest(this.ip, this.port);

            req.on("response", function() {
                cb(200, "Success");
            });

            req.on("error", function (err) {
                cb(500, err)
                console.log(err);
                return;
            });

            req.connect("/entry", "POST");
            req.write(qs);
            req.end();
        }

        public fetchLog(cmd: command.network.logCommand, cb: (err: Error, data: any) => void) {
            var req = new http.network.httpRequest(this.ip, this.port);

            req.on("response", function () {
                cb(null, req.data);
            });

            req.on("error", function (err) {
                cb(err, req.data);
                console.log(err);
                return;
            });

            req.connect(cmd.path, "GET");
            req.end();
        }

    }

}