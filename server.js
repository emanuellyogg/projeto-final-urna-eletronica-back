"use strict";
exports.__esModule = true;
var express = require("express");
var fs = require("fs");
var cors = require("cors");
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
var porta = 3001;
app.listen(porta, function () { });
app.get("/config", function (req, resp) {
    fs.readFile("configuracoes_gerais/config.csv", "utf-8", function (err, data) {
        var configuracoes = data.split(";"); //split = dividir
        console.log(configuracoes);
        configuracoes.splice(configuracoes.length - 1, 1); //splice=juntar
        resp.send(configuracoes);
        //neste momento compilo para o js, abro o servidor npm server.js e abre o postman
    });
});
