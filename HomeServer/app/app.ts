
/// <reference path="../lib/config.ts" />
/// <reference path="db.ts" />
/// <reference path="../lib/http.ts" />
/// <reference path="../lib/commands.ts" />
/// <reference path="../Scripts/typings/node/less.d.ts" />


import net = require("http");

import fs = require("fs");
//import less = require("less");


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

                self.database = new db.app.db(config.database);

                self.server = new http.network.http(config.http);
                self.server.run((req: net.ServerRequest, res: net.ServerResponse) => {

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
                                res.end();

                                var log = new http.network.httpRequest("localhost", 4040);

                                log.on("response", function (res: net.ClientResponse) {

                                });

                                log.on("error", function (err) {

                                });

                                log.connect("/log", "POST");


                                break;
                            }
                            case command.network.cmdType.cget: {
                                var result = self.configuration.retrieve(cmd.obj, cmd.id);
                                res.writeHead(result.code, { "Content-Type": "text/plain" });
                                res.end(result.data);
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

                    self.server.parse(req);

                });
                

                
            // Initially parse less and save css
            //var parser: less.Parser = new less.Parser({
            //    paths: [".", "./portal/content/", "./portal/content/imports/"],
            //});

            //var file = fs.readFileSync("./portal/content/main.less");
            //less.render(file.toString(), function (err, css) {
            //    fs.writeFileSync("./portal/content/main.css", css);
            //});
                
            //parser.parse(file.toString(), function (err, tree) {
            //    var css = tree.toCSS();
            //    fs.writeFileSync("./portal/content/main.css", css);
            //});


            });

            this.configuration.read();

        }


        public exec() {


        }
        
    }

}