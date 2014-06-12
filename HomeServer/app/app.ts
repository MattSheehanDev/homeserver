
/// <reference path="../lib/config.ts" />
/// <reference path="db.ts" />
/// <reference path="../lib/http.ts" />
/// <reference path="../lib/commands.ts" />
/// <reference path="../Scripts/typings/node/less.d.ts" />
/// <reference path="../lib/logger.ts" />


import net = require("http");

import fs = require("fs");
import qs = require("querystring");
import event = require("events");

//import less = require("less");


import config = require("../lib/config");
import db = require("./db");
import http = require("../lib/http");
import command = require("../lib/commands");
import logger = require("../lib/logger");


export module network {


    export class app extends event.EventEmitter {

        public configuration: config.network.configuration;
        public server: http.network.http;
        public log: logger.network.logger;
        public database: db.app.db;

        
        constructor() {
            super();

            this.configuration = new config.network.configuration(__dirname);

            var self = this;
            this.configuration.on("read", function (config: any) {

                //self.database = new db.app.db(config.database);

                self.log = new logger.network.logger(config.log);
                self.log.init("/log");

                self.server = new http.network.http(config.http);

                self.emit("ready");
            });

            this.configuration.on("error", function (err) {
                console.log(err);
                return;
            });

            this.configuration.read();
        }


        public run() {
            var self = this;
            this.server.run((req: net.ServerRequest, res: net.ServerResponse) => {
                req.on("command", function (cmd: any) {
                    switch (cmd.type) {
                        case command.network.cmdType.cpage: {
                            var filestream = fs.createReadStream(cmd.file);

                            filestream.on("error", function (err) {
                                res.writeHead(500);
                                res.end();
                                return;
                            });

                            res.writeHead(200, { "Content-Type": cmd.mime });
                            filestream.pipe(res);

                            // Logging
                            var addr = req.connection.address();
                            var str = qs.stringify({
                                type: "info",
                                from: addr.address + ":" + addr.port,
                                message: "Fetched: " + cmd.file,
                            });
                            self.log.sendLog((code: number, msg: string) => {

                            }, str);

                            break;
                        }
                        case command.network.cmdType.cget: {
                            if (cmd.obj == "log") {
                                self.log.fetchLogs((data: any) => {
                                    res.writeHead(200, { "Content-Type": "text/plain" });
                                    res.write(data);
                                    res.end();
                                });
                            }
                            else {
                                var result = self.configuration.retrieve(cmd.obj, cmd.id);
                                res.writeHead(result.code, { "Content-Type": "text/plain" });
                                res.end(result.data);
                            }
                            break;
                        }
                        case command.network.cmdType.cset: {
                            var result = self.configuration.update(cmd.obj, cmd.id, cmd.params);
                            res.writeHead(result.code)
                                res.end();
                            break;
                        }
                        case command.network.cmdType.cerror: {
                            res.writeHead(cmd.code);
                            res.end(cmd.error);
                            break;
                        }
                    }
                });

                req.on("error", function (err) {
                    console.log(err);
                    return;
                });

                self.server.parse(req);

            });
        }
        
    }

}