

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

                self.emit("read", self.config);

            });
        }

        public save() {
            var self = this;
            fs.writeFile(this.path, JSON.stringify(this.config), function (err) {


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
            else {
                res = new result(500, "Invalid Command");
            }

            return res;
        }

        public update(object: string, id: string, params: Map<string, string>) {
            var res: result;

            if (object == "http") {
                if (params.has("address")) {
                    this.config.http.address = params["address"];
                }
                res = new result(200);
            }
            else if (object == "database") {
                if (params.has("name")) {
                    this.config.database.name = params["name"];
                }
                else if (params.has("address")) {
                    this.config.database.address = params["address"];
                }
                res = new result(200);
            }
            else {
                res = new result(500, "Invalid Command");
            }

            return res;
        }

        public remove(object: string, id: string) {
            
        }

    }


    export class result {

        public code;
        public data;

        constructor(code, data = "{}") {
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