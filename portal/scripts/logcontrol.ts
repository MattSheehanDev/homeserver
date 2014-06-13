
/// <reference path="basecontrol.ts" />


module control {


    export class LogControl extends BaseControl {

        public address: KnockoutComputed<string>;
        public ip: KnockoutObservable<string>;
        public port: KnockoutObservable<number>;
        public log: KnockoutObservable<boolean>;

        constructor(asset: string) {
            super("log", asset);
            this.definition = "Logging is used to track connections and changes to the server."

            this.log = ko.observable<boolean>();
            this.ip = ko.observable<string>();
            this.port = ko.observable<number>();

            var self = this;
            this.address = ko.computed<string>(function () {
                return self.ip() + ":" + self.port();
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

                    data.log ? this.log(data.log) : null;
                },
                (xhr, status, error) => {
                });
        }

        public save() {
            setLogging({ address: this.address(), log: this.log() },
                (data, status, xhr) => {
                    message.show("Logging Saved.");
                },
                (xhr, status, error) => {
                    alert.call("Error: " + error);
                });
        }

    }

}