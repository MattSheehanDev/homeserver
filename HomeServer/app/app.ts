
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

            //var dir = __dirname;
            this.configuration = new config.network.configuration(__dirname);

            var self = this;
            this.configuration.on("read", function (config: any) {

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



                    //if (uri.pathname == "/") {

                    //}

                    //if (req.method == "GET") {
                    //    if (req.url == "/") {
                    //        fs.stat(__dirname + "/index.html", function (err, stat) {
                    //            if (err || !stat.isFile()) {
                    //                res.writeHead(404);
                    //                res.end("Not Found");
                    //            }
                    //            else {
                    //                //res.writeHead(200, { 'Content
                    //            }
                    //        });
                    //    }
                    //    else {
                    //        //var cmd = command.network.commands.parseHttp(req);
                    //        //var result = self.configuration.retrieve(cmd.object, cmd.id);
                    //        //res.writeHead(result.code, { "Content-Type": "text/plain" });
                    //        //res.end(result.data);
                    //    }
                    //}
                    //else if (req.method == "POST") {

                    //}
                    //else if (req.method == "DELETE") {

                    //}

                    //var cmd = command.network.commands.parseHttp(req);

                    //switch (cmd.verb) {
                    //    case command.network.action.get: {
                    //        var result = self.configuration.retrieve(cmd.object, cmd.id);
                    //        res.writeHead(result.code, { "Content-Type": "text/plain" });
                    //        res.end(result.data);
                    //        break;
                    //    }
                    //    case command.network.action.set: {
                    //        var body = "";
                    //        req.on("data", function (data) {
                    //            body += data;
                    //        });

                    //        req.on("end", function () {
                    //            var result = self.configuration.update(cmd.object, cmd.id, cmd.params);
                    //            res.writeHead(result.code, { "Content-Type": "text/plain" });
                    //            res.end();
                    //        });

                    //        break;
                    //    }
                    //    case command.network.action.delete: {

                    //        break;
                    //    }
                    //}
                });
                



            });

            this.configuration.read();

        }


        public exec() {


        }
        
    }

}