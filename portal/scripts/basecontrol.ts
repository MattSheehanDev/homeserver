
/// <reference path="typings/jquery.d.ts" />
/// <reference path="typings/knockout.d.ts" />


module control {


    export class BaseControl {

        public id: string;
        public asset: string;
        public definition: string;
        public count: KnockoutObservable<number>;

        constructor(id: string, asset: string) {

            this.id = id; 
            this.asset = asset;

            this.count = ko.observable<number>();
        }

    }


    export class ViewAllControl extends BaseControl {

        constructor(asset: string) {
            super("view all", asset);
        }
    }

}


// Knockout Extensions
interface KnockoutExtenders {
    isNumber(target: any, option: any): KnockoutObservable<any>;
}

ko.extenders.isNumber = function (target, def) {
    var result = ko.computed({
        read: target,
        write: function (value) {
            if (isNaN(value)) {
                target(def);
                target.notifySubscribers(def);
            }
            else {
                target(value);
            }
        }
    }).extend({ notify: "always" });

    result(target());
    return result;
}


// Knockout Bindings
interface KnockoutBindingHandlers {
    fadeVisible: {};
}

ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value));
    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn(250) : $(element).hide();
    }
}