
/// <reference path="config.ts" />
/// <reference path="commands.ts" />
/// <reference path="http.ts" />
/// <reference path="database.ts" />


import net = require("http");
import fs = require("fs");

import config = require("./config");
import command = require("./commands");
import http = require("./http");
import db = require("./database");


export module network {


    export class app {


        public configuration: config.network.configuration;
        public database: db.network.database;
        public server: http.network.http;


        constructor() {

            this.configuration = new config.network.configuration(__dirname);

            var self = this;
            this.configuration.on("read", function (config: any) {

                //self.database = new db.app.db(config.database);
                self.database = new db.network.database(config.database);
                var entry = self.database.openConnectionSync("entry");
                var date: Date = new Date();
                var d = date.getDate();
                var t = date.getTime();
                var y = date.toUTCString();
                var u = date.toLocaleString();
                var p = date.getUTCDate();

                self.server = new http.network.http(config.http);
                self.server.run((req: net.ServerRequest, res: net.ServerResponse) => {

                    req.on("command", function (cmd: any) {
                        switch (cmd.type) {
                            //case command.network.cmdType.cpage: {
                            //    var filestream = fs.createReadStream(cmd.file);

                            //    filestream.on("error", function (err) {
                            //        res.writeHead(500);
                            //        res.end();
                            //        return;
                            //    });

                            //    res.writeHead(200, { "Content-Type": cmd.mime });
                            //    filestream.pipe(res);
                            //    break;
                            //}
                            case command.network.cmdType.cget: {
                                if (cmd.obj == "log") {
                                    self.database.openCollection("entry");
                                    entry.insert
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