

module control {

    export var baseuri = location.protocol + "//" + location.host + "/"

    export function getServer(success: (data: any, status: any, xhr: JQueryXHR) => void, error: (xhr: JQueryXHR, status: any, data: any) => void) {
        $.ajax({
            url: baseuri + "http",
            type: "GET",
            dataType: "json",
            success: success,
            error: error,
        });
    }

    export function setServer(data: any, success: (data: any, status: any, xhr: JQueryXHR) => void, error: (xhr: JQueryXHR, status: any, data: any) => void) {
        $.ajax({
            url: baseuri + "http",
            type: "POST",
            dataType: "text",
            data: data,
            success: success,
            error: error,
        });
    }

    export function getDatabase(success: (data: any, status: any, xhr: JQueryXHR) => void, error: (xhr: JQueryXHR, status: any, error: any) => void) {
        $.ajax({
            url: baseuri + "database",
            type: "GET",
            dataType: "json",
            success: success,
            error: error,
        });
    }

    export function setDatabase(data: any, success: (data: any, status: any, xhr: JQueryXHR) => void, error: (xhr: JQueryXHR, status: any, error: any) => void) {
        $.ajax({
            url: baseuri + "database",
            type: "POST",
            dataType: "text",
            data: data,
            success: success,
            error: error,
        });
    }

    export function getLogging(success: (data: any, status: any, xhr: JQueryXHR) => void, error: (xhr: JQueryXHR, status: any, error: any) => void) {
        $.ajax({
            url: baseuri + "logging",
            type: "GET",
            dataType: "json",
            success: success,
            error: error,
        });
    }

    export function setLogging(data: any, success: (data: any, status: any, xhr: JQueryXHR) => void, error: (xhr: JQueryXHR, status: any, error: any) => void) {
        $.ajax({
            url: baseuri + "logging",
            type: "POST",
            dataType: "text",
            data: data,
            success: success,
            error: error,
        });
    }

}
