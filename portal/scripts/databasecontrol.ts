
/// <reference path="basecontrol.ts" />
/// <reference path="api.ts" />



module control {

    export class DatabaseControl extends BaseControl {

        public name: KnockoutObservable<string>;
        public ip: KnockoutObservable<string>;
        public port: KnockoutObservable<number>;
        public address: KnockoutComputed<string>;

        constructor(asset: string) {
            super("database", asset);
            this.definition = "Database Configurations to change the IP and Port used for database connections, as well as the database name.";

            this.name = ko.observable<string>();
            this.ip = ko.observable<string>();
            this.port = ko.observable<number>();

            var self = this;
            this.address = ko.computed(function () {
                return self.ip() + ":" + self.port();
            });

            this.fetch();
        }


        public fetch() {
            getDatabase(
                (data, status, xhr) => {
                    var address: string = data.address;
                    var parts = address.split(":");
                    parts[0] ? this.ip(parts[0]) : null;
                    parts[1] ? this.port(parseInt(parts[1])) : null;

                    this.name(data.name);
                },
                (xhr, status, error) => {
                });
        }

        public save() {
            setDatabase({ name: this.name(), address: this.address() },
                (data, status, xhr) => {
                    message.show("Database Saved.");
                },
                (xhr, status, error) => {
                    alert.call("Error: " + error);
                });
        }

    }

}