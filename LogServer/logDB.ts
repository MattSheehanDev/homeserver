
/// <reference path="database.ts" />


import database = require("./database");
import mongodb = require("mongodb");


export module network {

    export class logDB {

        public db: database.network.database;
        public log: database.network.collection;
        public counter: database.network.collection;

        constructor(config: any) {
            this.db = new database.network.database(config);

            var self = this;
            this.db.on("open", function () {
                self.log = self.db.openConnectionSync("entry");
                self.counter = self.db.openConnectionSync("counter");

                self.log.on("error", function (err) {
                    var p = "";
                });

                self.counter.on("error", function (err) {
                    var p = "";
                });
            });

            this.db.on("error", function (err) {
                console.log(err);
                return;
            });
        }


        public nextCounter(cb: (seq: number) => void) {
            this.counter.findAndModify({ _id: "log_id" }, [], { $inc: { seq: 1 } }, { new: true }, function (doc) {
                cb(doc.seq);
            });
        }

        public find(params: any, cb: (err, cursor) => void) {
            if (params == null) {
                this.log.find(cb);
            }
            else {
                var data: any = new Object();
                params["id"] ? data._id = parseInt(params["id"]) : null;
                params["type"] ? data.type = params["type"] : null;
                this.log.find(cb, data);
            }
        }

    }

}