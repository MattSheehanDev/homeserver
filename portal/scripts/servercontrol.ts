
/// <reference path="basecontrol.ts" />
/// <reference path="api.ts" />


module control {


    export class ServerControl extends BaseControl {

        public ip: KnockoutObservable<string>;
        public port: KnockoutObservable<number>;
        public address: KnockoutObservable<string>;

        constructor(asset: string) {
            super("server", asset);
            this.definition = "Server Configurations to modify the IP and Port using for incoming connections.";

            this.ip = ko.observable<string>();
            this.port = ko.observable<number>();

            var self = this;
            this.address = ko.computed(function () {
                return self.ip() + ":" + self.port();
            });

            this.fetch();
        }


        public fetch() {
            getServer(
                (data, status, xhr) => {
                    var address: string = data.address;
                    var parts = address.split(":");
                    parts[0] ? this.ip(parts[0]) : null;
                    parts[1] ? this.port(parseInt(parts[1])) : null;
                },
                (xhr, status, error) => {
                });
        }

        public save() {
            setServer({ address: this.address() },
                (data, status, xhr) => {
                    message.show("Server Saved.");
                },
                (xhr, status, error) => {
                    alert.call("Error: " + error);
                });
        }

    }

}