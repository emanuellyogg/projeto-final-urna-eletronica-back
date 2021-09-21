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
// Rota que busca validar o usuário logado
app.get("/validaUsuario", function (req, res) {
    var data = (0, fs_1.readFileSync)("./opcoes_usuarios/usuarios.csv", "utf-8");
    var listaUser = [];
    listaUser.push(data.split(";"));
    // número do CPF digitado
    var user = req.body.nmUser;
    console.log(typeof listaUser);
    // verificador de user valido ou inválido
    var isValid = false;
    for (var i = 0; i < listaUser[0].length - 1; i++) {
        var element = listaUser[0][i];
        if (user == element) {
            console.log("validado");
            isValid = true;
            break;
        }
    }
    console.log(isValid);
    // retorno para o frontend
    if (isValid) {
        res.send(true);
    }
    else {
        res.send(false);
    }
});
