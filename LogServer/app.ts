
/// <reference path="config.ts" />
/// <reference path="commands.ts" />
/// <reference path="http.ts" />
/// <reference path="logDB.ts" />


import net = require("http");
import fs = require("fs");
import event = require("events");

import config = require("./config");
import command = require("./commands");
import http = require("./http");
import db = require("./logDB");


export module network {


    export class app extends event.EventEmitter {


        public configuration: config.network.configuration;
        public database: db.network.logDB;
        public server: http.network.http;


        constructor() {
            super();

            this.configuration = new config.network.configuration(__dirname);

            var self = this;
            this.configuration.on("read", function (config: any) {

                self.database = new db.network.logDB(config.database);
                self.server = new http.network.http(config.http);

                self.emit("ready");
            });

            this.configuration.read();
        }


        public run() {
            var self = this;
            this.server.run((req: net.ServerRequest, res: net.ServerResponse) => {
                req.on("command", function (cmd: any) {
                    switch (cmd.type) {
                        case command.network.cmdType.cget: {
                            if (cmd.obj == "entry") {
                                self.database.find(cmd.params, (err, cursor) => {
                                    var json = new Object();

                                    cursor.each((err, item) => {
                                        if (err) {
                                            req.emit("error", err);
                                            return;
                                        }
                                        else if (!item) {
                                            res.writeHead(200)
                                            res.write(JSON.stringify(json, null, 4));
                                            res.end();
                                        }
                                        else {
                                            json[item._id] = item;
                                        }
                                    });
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
                            if (cmd.obj == "entry") {
                                self.database.nextCounter(function (seq: number) {
                                    self.database.log.insert({
                                        _id: seq,
                                        date: new Date(),
                                        from: cmd.params.from,
                                        type: cmd.params.type,
                                        message: cmd.params.message,
                                    });
                                });
                                res.writeHead(200);
                                res.end();
                            }
                            else {
                                var result = self.configuration.update(cmd.obj, cmd.id, cmd.params);
                                res.writeHead(result.code);
                                res.end();
                            }
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
                    res.writeHead(500, err);
                    res.end();
                    return;
                });

                self.server.parse(req);
            });
        }

    }

}