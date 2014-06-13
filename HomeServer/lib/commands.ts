﻿

export module network {


    export enum cmdType {
        cget,
        cset,
        cdelete,
        cpage,
        clog,
        cerror,
    }


    export class command {
        public type: cmdType;

        constructor(type: cmdType) {
            this.type = type;
        }
    };


    export class getCommand extends command {

        public obj: string;
        public id: string;

        constructor(obj: string, id: string) {
            super(cmdType.cget);

            this.obj = obj;
            this.id = id;
        }
    }


    export class postCommand extends command {

        public obj: string;
        public id: string;
        public params: any;
        public body: any;

        constructor(obj: string, id: string) {
            super(cmdType.cset);

            this.obj = obj;
            this.id = id;
            this.body = "";
        }
    }


    export class pageCommand extends command {

        public mime: string;
        public file: string;

        constructor(mime, file) {
            super(cmdType.cpage);

            this.mime = mime;
            this.file = file;
        }
    }


    export class logCommand extends command {

        public path: string;

        constructor(path: string) {
            super(cmdType.clog);

            this.path = path;
        }
    }


    export class errorCommand extends command {

        public code: number;
        public error: string;

        constructor(code: number, error: string) {
            super(cmdType.cerror);

            this.code = code;
            this.error = error;
        }
    }

}