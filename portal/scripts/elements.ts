

module control {


    export class messageBox {

        public container: HTMLElement;
        public messageContainer: HTMLElement;
        public message: HTMLElement;
        private timeout: number;

        constructor() {

            this.container = document.createElement("div");
            this.container.style.textAlign = "center";
            this.container.style.verticalAlign = "middle";
            this.container.style.position = "fixed";
            this.container.style.background = "#3c454f";
            this.container.style.border = "#000 1px solid";
            this.container.style.color = "#fff";
            this.container.style.width = "300px";
            this.container.style.height = "100px";

            this.messageContainer = document.createElement("div");
            this.messageContainer.className = "column full";
            this.container.appendChild(this.messageContainer);

            this.message = document.createElement("p");
            this.messageContainer.appendChild(this.message);

            var self = this;
            $(window).resize(function () {
                $(self.container).css("left", ((window.innerWidth / 2) - ($(self.container).width() / 2)) + "px");
                $(self.container).css("top", ((window.innerHeight / 2) - ($(self.container).height() / 2)) + "px");
            });
        }


        public show(message: string, close: boolean = true) {
            $(this.container).css("left", ((window.innerWidth / 2) - ($(this.container).width() / 2)) + "px");
            $(this.container).css("top", ((window.innerHeight / 2) - ($(this.container).height() / 2)) + "px");

            $(this.message).html(message);

            document.body.appendChild(this.container);
            $(this.container).show();

            clearTimeout(this.timeout);

            if (close) {
                var self = this;
                this.timeout = setTimeout(function () {
                    $(self.container).fadeOut(1000, function () {
                        self.hide(true);
                    });
                }, 2000);
            }
        }

        public hide(now: boolean = false) {

            if (now) {
                $(this.container).remove();
            }
            else {
                var self = this;
                this.timeout = setTimeout(function () {
                    $(self.container).fadeOut(1000, function () {
                        self.hide(true);
                    });
                }, 2000);
            }
        }

    }



    export class callBox extends messageBox {

        public button: HTMLElement;


        constructor(buttonText: string) {
            super();

            this.button = document.createElement("a");
            this.button.className = "messageBtn";
            this.button.style.cursor = "pointer";
            this.button.style.width = "100px";
            this.button.style.position = "absolute";
            this.button.style.bottom = "2px";
            this.button.style.right = "2px";
            $(this.button).attr("src", "/");
            $(this.button).html(buttonText);

            this.container.appendChild(this.button);
        }
        

        public call(message: string, callback?: () => {}) {

            var self = this;
            $(this.button).click(function () {
                if (callback) {
                    callback();
                }
                self.hide(true);
            });

            $(this.button).focus();
            super.show(message, false);
        }

    }


    export class submitBox extends callBox {

        public input: HTMLElement;
        public cancel: HTMLElement;


        constructor() {
            super("Submit");
            
            this.cancel = document.createElement("a");
            this.cancel.className = "messageBtn";
            this.cancel.style.cursor = "pointer";
            this.cancel.style.width = "100px";
            this.cancel.style.position = "absolute";
            this.cancel.style.bottom = "2px";
            this.cancel.style.left = "2px";
            $(this.cancel).attr("src", "/");
            $(this.cancel).html("Cancel");

            this.container.appendChild(this.cancel);

            this.input = document.createElement("input");
            this.messageContainer.appendChild(this.input);
        }


        public submit(message: string, callback: (value: string) => void) {

            var self = this;
            $(this.button).click(function () {
                callback($(self.input).val());
                $(self.input).val("");
                self.hide(true);
            });

            $(this.cancel).click(function () {
                self.hide(true);
            });

            $(this.input).focus();
            super.show(message, false);
        }

    }

}