"use strict";
exports.__esModule = true;
var express = require("express");
var cors = require("cors");
var fs_1 = require("fs");
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
var porta = 3001;
app.listen(porta, function () {
    console.log("Servidor rodando na porta " + porta);
});
app.get("/validaUsuario", function (req, res) {
    var data = (0, fs_1.readFileSync)("./opcoes_usuarios/usuariosRG.csv", "utf-8");
    res.json({ data: data });
});
