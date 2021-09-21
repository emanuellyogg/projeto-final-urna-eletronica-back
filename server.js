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
var path = require("path");
var cors = require("cors");
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
var porta = 3001;
app.listen(porta, function () { });
var inicioVotacao;
var finalVotacao;
var ehAnonima;
app.get("/config", function (req, resp) {
    fs.readFile("configuracoes_gerais/config.csv", "utf-8", function (err, data) {
        return __awaiter(this, void 0, void 0, function () {
            var configuracoes, candidatosObj, resposta;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        configuracoes = data.split(";") //split = dividir
                        ;
                        console.log(configuracoes);
                        configuracoes.splice(configuracoes.length - 1, 1); //splice=juntar
                        //2 criaçao das variaveis globais
                        inicioVotacao = configuracoes[1];
                        finalVotacao = configuracoes[2];
                        if (configuracoes[0] == "NA") {
                            ehAnonima = false;
                        }
                        else {
                            ehAnonima = true;
                        }
                        return [4 /*yield*/, criaVetorCandidatos(configuracoes[3])];
                    case 1:
                        candidatosObj = _a.sent();
                        if (candidatosObj.validacao) {
                            resposta = {
                                ehAnonima: ehAnonima,
                                inicioVotacao: inicioVotacao,
                                finalVotacao: finalVotacao,
                                candidatos: candidatosObj.candidatos
                            };
                            resp.json(resposta);
                        }
                        else if (candidatosObj.validacao == false || err) {
                            resp.json({ "status": 500, "mensagem": "erro na leitura do arquivo" });
                        }
                        return [2 /*return*/];
                }
            });
        });
    });
});
//3
function criaVetorCandidatos(arquivoConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var caminho, dados, dadosCandidatos, cand, i, candidatoLinha, candidatos, index, candidato, index, candidato, index, candidato, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    caminho = path.join("config_opcoes/", arquivoConfig);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fsPromises.readFile(caminho, "utf-8")];
                case 2:
                    dados = _a.sent();
                    dadosCandidatos = dados.split("\r\n");
                    cand = [];
                    for (i = 0; i < dadosCandidatos.length; i++) {
                        candidatoLinha = dadosCandidatos[i].split(";");
                        candidatoLinha.splice(candidatoLinha.length - 1, 1);
                        cand.push(candidatoLinha);
                    }
                    candidatos = [];
                    if (cand[0].length == 2) {
                        for (index = 0; index < cand.length; index++) {
                            candidato = {
                                numCand: cand[index][0],
                                nomeCand: cand[index][1]
                            };
                            candidatos.push(candidato);
                        }
                    }
                    else if (cand[0].length == 3) {
                        for (index = 0; index < cand.length; index++) {
                            candidato = {
                                numCand: cand[index][0],
                                nomeCand: cand[index][1],
                                imgCand: cand[index][2]
                            };
                            candidatos.push(candidato);
                        }
                    }
                    else if (cand[0].length == 4) {
                        for (index = 0; index < cand.length; index++) {
                            candidato = {
                                numCand: cand[index][0],
                                nomeCand: cand[index][1],
                                imgCand: cand[index][2],
                                descCand: cand[index][3]
                            };
                            candidatos.push(candidato);
                        }
                    }
                    return [2 /*return*/, { validacao: true, candidatos: candidatos }];
                case 3:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [2 /*return*/, { validacao: false }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
