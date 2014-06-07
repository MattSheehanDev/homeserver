
/// <reference path="options.ts" />


export module control {


    export class server {

        public ip: KnockoutObservable<string>;
        public port: KnockoutObservable<number>;
        public address: KnockoutObservable<string>;

        constructor() {

            this.ip = ko.observable<string>();
            this.port = ko.observable<number>();

            this.address = ko.computed(function () {
                return this.ip() + ":" + this.port();
            });

            this.fetch();
        }


        public fetch() {

        }

    }

}