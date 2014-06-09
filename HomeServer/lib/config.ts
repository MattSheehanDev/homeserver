

import fs = require("fs");
import event = require("events");


export module network {


    export class configuration extends event.EventEmitter {


        public file: any
        public path: string;
        public config: any;
        public json: string;
        //public scheme: schema;
        

        constructor(path: string) {
            super();

            //this.scheme = new schema();

            if (path[path.length-1] != "/") {
                path += "/"
            }

            this.path = path + "homeserver.config";
        }


        public read() {
            var self = this;
            fs.readFile(this.path, function (err, data: NodeBuffer) {

                if (err) {
                    self.json = "{}";
                }
                else {
                    var json = data.toString();
                    json != "" ? self.json = json : self.json = "{}";
                }

                self.config = JSON.parse(self.json);

                var save = false;

                if (!self.config.http) {
                    self.config.http = new Object();
                    self.config.http.address = "localhost:8080";
                    save = true;
                }
                if (!self.config.database) {
                    self.config.database = new Object();
                    self.config.database.name = "homeserver";
                    self.config.database.address = "localhost:27017";
                    save = true;
                }
                if (!self.config.log) {
                    self.config.log = new Object();
                    self.config.log.address = "localhost:4040";
                    self.config.log.logging = true;
                    save = true;
                }

                if (save) {
                    self.save();
                }

                self.emit("read", self.config);

            });
        }

        public save() {
            var self = this;
            fs.writeFile(this.path, JSON.stringify(this.config, null, 4), function (err) {


            });
        }

        public retrieve(object: string, id: string) {
            var res: result;

            if (object == "http") {
                res = new result(200, JSON.stringify(this.config.http));
            }
            else if (object == "database") {
                res = new result(200, JSON.stringify(this.config.database));
            }
            else if (object == "log") {
                res = new result(200, JSON.stringify(this.config.log));
            }
            else {
                res = new result(500, "Invalid Command");
            }

            return res;
        }

        public update(object: string, id: string, params: any) {
            var res: result;

            var save = false;
            if (object == "http") {
                if (params["address"]) {
                    this.config.http.address = params["address"];
                    save = true;
                }
                res = new result(200);
            }
            else if (object == "database") {
                if (params["name"]) {
                    this.config.database.name = params["name"];
                    save = true;
                }
                if (params["address"]) {
                    this.config.database.address = params["address"];
                    save = true;
                }
                res = new result(200);
            }
            else if (object == "log") {
                if (params["address"]) {
                    this.config.log.address = params["address"];
                    save = true;
                }
                if (params["logging"]) {
                    this.config.log.logging = params["logging"];
                    save = true;
                }
            }
            else {
                res = new result(500, "Invalid Command");
            }

            if (save) {
                this.save();
            }

            return res;
        }

        public remove(object: string, id: string) {
            
        }

    }


    export class result {

        public code: number;
        public data: any;

        constructor(code, data = null) {
            this.code = code;
            this.data = data;
        }

    }


    export class schema {


        public objects: Map<string, Array<string>>;
        public singletons: Array<string>;


        constructor() {

            this.objects = new Map<string, Array<string>>();
            this.singletons = new Array<string>();
        }

    }

}