

export module control {

    export var baseuri = location.protocol + "//" + location.hostname + "/"

    export function getServer(success: (data: any, status: any, xhr: any) => void, error: (xhr: any, status: any, data: any) => void) {
        $.ajax({
            url: baseuri + "server",
            dataType: "json",
            success: success,
            error: error,
        });
    }

}
