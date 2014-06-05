

import net = require("http");
import qs = require("querystring");


export module network {


    export enum action {
        get,
        set,
        delete,
    }


    export class commands {

        public object: string;
        public id: string;
        public params: Map<string, string>;
        public verb: action;
        

        constructor(verb: action, obj: string, id: string, query?: string) {

            this.verb = verb;
            this.object = obj;
            this.id = id;

            if (query) {
                this.params = qs.parse(query);
            }
        }



        public static parseHttp(req: net.ServerRequest) {

            var cmd: commands;
            var query: string;

            var uri = req.url;

            var delim = uri.indexOf("?");
            if (delim != -1) {
                query = uri.substr(delim+1, uri.length - delim);
                uri = uri.substr(0, delim);
            }

            if (uri.charAt(0) == "/") {
                uri = uri.slice(1, uri.length);
            }
            if (uri.charAt(uri.length - 1) != "/") {
                uri += "/";
            }

            var parts = uri.split("/");
            if (parts.length < 2) throw Error("Invalid Command");

            var obj = parts[0];
            var id = parts[1];

            if (req.method == "GET") {
                cmd = new commands(action.get, obj, id, query);
            }
            else if (req.method == "POST") {
                cmd = new commands(action.set, obj, id, query);
            }
            else if (req.method == "DELETE") {
                cmd = new commands(action.delete, obj, id);
            }

            return cmd;
        }

    }

}