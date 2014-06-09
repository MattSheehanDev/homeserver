
/// <reference path="Scripts/typings/node/mongodb.d.ts" />


import mongodb = require("mongodb");
import event = require("events");



export module network {


    export class database extends event.EventEmitter {

        public collections: Map<string, collection>;
        public db: mongodb.Db;
        public name: string;
        public ip: string;
        public port: number;


        constructor(config: any) {
            super();

            this.name = config.name ? config.name : "log";

            var address = config.address ? config.address : "localhost:27017";
            var parts = address.split(":");
            this.ip = parts[0];
            this.port = parseInt(parts[1]);

            var options: mongodb.DbCreateOptions = {
                w: "majority",
            }

            this.db = new mongodb.Db(this.name, new mongodb.Server(this.ip, this.port, { auto_reconnect: true }), options);
            this.open();
        }


        public open() {
            var self = this;
            this.db.open(function (err, db: mongodb.Db) {
                if (err) {
                    self.emit('error', err);
                    return;
                }
                self.emit('open');
            });
        }

        public close(lazy: boolean = false) {
            if (this.db) {
                var self = this;
                this.db.close(lazy, function (err, result) {
                    if (err) {
                        self.emit('error', err);
                        return;
                    }
                    self.emit('close', result);
                });
            }
        }

        public createCollection(name: string) {
            var self = this;
            this.db.createCollection(name, function (err, col: mongodb.Collection) {
                if (err) {
                    self.emit("error", err);
                }
                self.emit("createcol", new collection(name, col));
            });
        }

        public openCollection(name: string) {
            var self = this;
            this.db.collection(name, function (err, col: mongodb.Collection) {
                if (err) {
                    self.emit("error", err);
                }
                self.emit("opencol", new collection(name, col));
            });
        }

        public openConnectionSync(name: string) {
            return new collection(name, this.db.collection(name));
        }

    }



    export class collection extends event.EventEmitter {

        public name: string;
        public collection: mongodb.Collection;


        constructor(name: string, c: mongodb.Collection) {
            super();

            this.name = name;
            this.collection = c;
        }


        public insert(data: any, cb?: (result: any) => void) {
            var self = this;
            this.collection.insert(data, function (err, result) {
                if (err) {
                    self.emit('error', err);
                    return;
                }
                if (cb) {
                    cb(result)
                }

            });
        }


        public update(data: Array<any>) {
            var self = this;
            this.collection.update(data, function (err, result) {

                if (err) {
                    self.emit('error', err);
                    return;
                }


            });
        }


        public drop() {
            var self = this;
            this.collection.drop(function (err, result) {

                if (err) {
                    self.emit('error', err);
                    return;
                }
            });
        }

    }



    export class document {

        public traits: Map<string, field>;

        constructor(schema: any) {

            for (var i = 0; i < schema.length; i++) {
                var field = schema[i];
            }
        }
    }




    export class field {

        public key: any;

        constructor(key: any) {

            this.key = key;
        }

    }

}