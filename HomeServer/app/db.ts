
/// <reference path="../lib/database.ts" />

import database = require("../lib/database");


export module app {


    export class db {

        public db: database.network.database;

        constructor(address: string) {

            this.db = new database.network.database("home", address);

            this.db.on('connect', function () {

                //var deviceSchema = new database.network.schema({
                //    id: Number,
                //    name: String,
                //});
                var devices: database.network.collection = this.db.collection("devices");

                devices.on('error', function (err) {

                });


            });

            this.db.on('error', function (err) {

            });

            this.db.on('close', function (result) {

            });
        }
    }

}