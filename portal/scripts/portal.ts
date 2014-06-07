
/// <reference path="options.ts" />



module control {


    export var homePortal: portal;


    export class portal {


        constructor() {

            $(".container").height($(document).height());
            
            ko.applyBindings(this);
        }

    }

}