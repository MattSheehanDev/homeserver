
/// <reference path="../lib/database.ts" />

import database = require("../lib/database");


export module app {


    export class db {

        public db: database.network.database;

        constructor(config: any) {

            this.db = new database.network.database(config.name, config.address);

            this.db.on('connect', function () {

                var devices: database.network.collection = this.db.collection("devices");

                devices.on('error', function (err) {

                });


            });

            this.db.on('error', function (err) {
                console.log(err);
            });

            this.db.on('close', function (result) {

            });
        }
    }

}