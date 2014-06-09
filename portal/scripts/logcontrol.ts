
/// <reference path="basecontrol.ts" />


module control {


    export class LogControl extends BaseControl {

        public address: KnockoutComputed<string>;
        public ip: KnockoutObservable<string>;
        public port: KnockoutObservable<number>;
        public logging: KnockoutObservable<boolean>;

        constructor(asset: string) {
            super("log", asset);
            this.definition = "Logging is used to track connections and changes to the server."

            this.logging = ko.observable<boolean>();
            this.ip = ko.observable<string>();
            this.port = ko.observable<number>();

            this.address = ko.computed<string>(function () {
                return this.ip() + ":" + this.port();
            });

            this.fetch();
        }


        public fetch() {
            getLogging(
                (data, status, xhr) => {
                    var address: string = data.address ? data.address : "";
                    var parts = address.split(":");

                    parts[0] ? this.ip(parts[0]) : null;
                    parts[1] ? this.port(parseInt(parts[1])) : null; 

                    data.logging ? this.logging(data.logging) : null;
                },
                (xhr, status, error) => {
                });
        }

        public save() {
            setLogging({ address: this.address(), logging: this.logging() },
                (data, status, xhr) => {
                    message.show("Logging Saved.");
                },
                (xhr, status, error) => {
                    alert.call("Error: " + error);
                });
        }

    }

}