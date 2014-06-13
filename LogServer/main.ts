
/// <reference path="app.ts" />


import application = require("./app");

var app = new application.network.app();

app.on("ready", function () {
    app.run();
});