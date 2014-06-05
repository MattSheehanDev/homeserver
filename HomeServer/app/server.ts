

/// <reference path="app.ts" />


import application = require("./app");


var app = new application.network.app();



//import http = require("http");
//import database = require("../lib/database");

//import file = require("../lib/config");



//var config = new file.network.config(__dirname);

//config.on('read', function (json: string) {

//    var parsed = JSON.parse(json);

//    if (!parsed.http) {
//        parsed.http = new Object();
//        parsed.http.address = "http://localhost:8080";
//    }
//    if (!parsed.database) {
//        parsed.database = new Object();
//        parsed.database.name = "homeserver";
//    }

//    config.json = JSON.stringify(parsed);
//    config.save();



//});


//config.read();


//var db = new database.network.database("test", "localhost:27017");
//db.open();
//db.addCollection("collection1");


//var port = process.env.port || 1337
//    http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end('Hello World\n');
//}).listen(port);
