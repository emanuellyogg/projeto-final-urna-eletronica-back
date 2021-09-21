"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express = require("express");
var fs = require("fs");
var fsPromises = require("fs/promises");
var cors = require("cors");
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
var porta = 3001;
app.listen(porta, function () { });
app.post("/voto", verificaVoto, function (req, resp) {
    var voto = req.body.eleitor + ";" + req.body.valueVoto + ";" + req.body.nameVoto + ";" + req.body.timestamp + "\n";
    fs.appendFile("votos.csv", voto, function (err) {
        if (err) {
            resp.json({
                "Status": "500",
                "Mensagem": "Erro ao registrar voto, contate o administrador do sistema"
            });
        }
        else {
            resp.json({
                "Status": "200",
                "Mensagem": "Voto Registrado Com sucesso"
            });
        }
    });
});
//Função que vai verificar se o voto é repetido ou não e se está dentro do período de votação
function verificaVoto(req, resp, next) {
    return __awaiter(this, void 0, void 0, function () {
        var verificaVoto1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, verificaRepetido(req.body.eleitor)];
                case 1:
                    verificaVoto1 = _a.sent();
                    console.log(verificaVoto1);
                    //let verificaVoto2 = await verificaPrazoVoto(req.body.timestamp)
                    if (verificaVoto1.validacao) { //&& verificaVoto2.validacao){
                        if (verificaVoto1.naoRepete) { //&& verificaVoto2.validacao){
                            next();
                        }
                        else {
                            if (!verificaVoto1.naoRepete) {
                                return [2 /*return*/, resp.json({
                                        "status": "401",
                                        "mensagem": "Você só pode votar uma vez"
                                    })];
                            }
                            else {
                                return [2 /*return*/, resp.json({
                                        "status": "401",
                                        "mensagem": "Voto fora do período de votação"
                                    })];
                            }
                        }
                    }
                    else {
                        return [2 /*return*/, resp.json({
                                "status": "500",
                                "mensagem": "Erro ao ler arquivo"
                            })];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function verificaRepetido(eleitor) {
    return __awaiter(this, void 0, void 0, function () {
        var naoRepete, data, dados, i, voto, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    naoRepete = true;
                    return [4 /*yield*/, fsPromises.readFile("votos.csv", "utf-8")];
                case 1:
                    data = _a.sent();
                    dados = data.split("\n");
                    for (i = 0; i < dados.length; i++) {
                        voto = dados[i].split(";");
                        if (voto[0] == eleitor) {
                            naoRepete = false;
                        }
                    }
                    return [2 /*return*/, { validacao: true, naoRepete: naoRepete }];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [2 /*return*/, { validacao: false }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
