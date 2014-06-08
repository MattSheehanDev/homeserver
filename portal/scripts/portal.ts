
/// <reference path="servercontrol.ts" />
/// <reference path="databasecontrol.ts" />
/// <reference path="elements.ts" />



module control {


    export var message: messageBox = new messageBox();
    export var alert: callBox = new callBox("OK");
    export var submit: submitBox = new submitBox();


    export var homePortal: portal;


    export class portal {

        public view: ViewAllControl;
        public server: ServerControl;
        public database: DatabaseControl;

        public control: KnockoutObservable<BaseControl>;
        public controls: Array<BaseControl>;

        constructor() {

            this.control = ko.observable<BaseControl>();
            this.controls = [];

            this.view = new ViewAllControl("../images/magnifier.png");
            this.server = new ServerControl("../images/server.png");
            this.database = new DatabaseControl("../images/database.png");

            this.controls.push(this.view);
            this.controls.push(this.server);
            this.controls.push(this.database);

            this.control.subscribe(function () {
                message.hide(true);
                alert.hide(true);
                submit.hide(true);
            });

            $(".container").height($(document).height());
            
            ko.applyBindings(this);
        }


        public selectControl(control: BaseControl) {
            this.control(control);
        }

    }

}