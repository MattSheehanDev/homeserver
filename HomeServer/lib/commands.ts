

export module network {


    export enum cmdType {
        cget,
        cset,
        cdelete,
        cpage,
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


    export class pageCommand extends command {

        public mime: string;
        public file: string;

        constructor(mime, file) {
            super(cmdType.cpage);

            this.mime = mime;
            this.file = file;
        }
    }

}