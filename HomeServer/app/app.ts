
/// <reference path="../lib/config.ts" />
/// <reference path="db.ts" />
/// <reference path="../lib/http.ts" />
/// <reference path="../lib/commands.ts" />


import net = require("http");


import config = require("../lib/config");
import db = require("./db");
import http = require("../lib/http");
import command = require("../lib/commands");




export module network {


    export class app {


        public configuration: config.network.configuration;
        public database: db.app.db;
        public server: http.network.http;


        constructor() {

            this.configuration = new config.network.configuration(__dirname);

            var self = this;
            this.configuration.on("read", function (config: any) {


                //error?? not right
                if (!config.http) {
                    config.http = new Object();
                    config.http.address = "localhost:8080";
                }
                if (!config.database) {
                    config.database = new Object();
                    config.database.name = "homeserver";
                    config.database.address = "localhost:27017";
                }


                //error ??
                self.configuration.save();


                self.server = new http.network.http(config.http);
                self.server.run((req: net.ServerRequest, res: net.ServerResponse) => {

                    var cmd = command.network.commands.parseHttp(req);

                    switch (cmd.verb) {
                        case command.network.action.get: {
                            var result = self.configuration.retrieve(cmd.object, cmd.id);
                            res.writeHead(result.code, { "Content-Type": "text/plain" });
                            res.end(result.data);
                            break;
                        }
                        case command.network.action.set: {
                            var body = "";
                            req.on("data", function (data) {
                                body += data;
                            });

                            req.on("end", function () {
                                var result = self.configuration.update(cmd.object, cmd.id, cmd.params);
                                res.writeHead(result.code, { "Content-Type": "text/plain" });
                                res.end();
                            });

                            break;
                        }
                        case command.network.action.delete: {

                            break;
                        }
                    }
                });
                



            });

            this.configuration.read();

        }


        public exec() {


        }
        
    }

}