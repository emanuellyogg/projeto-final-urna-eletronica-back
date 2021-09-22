import * as express from "express";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import * as cors from "cors";
import { readFileSync } from "fs";
import { sha256 } from 'js-sha256';


const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());
const porta = 3001;

app.listen(porta, function () {
    lerConfig()
    console.log("Servidor rodando na porta " + porta);
});

//-------------------------VARIÁVEIS---------------------------------

var inicioVotacao: string
var finalVotacao: string
var ehAnonima: boolean
var candidatosDoConfig: object[]

//------------------------------ROTAS--------------------------------

// Rota que busca validar o usuário logado
app.get("/validaUsuario", function (req, res) {
    const data = readFileSync("./opcoes_usuarios/usuarios.csv", "utf-8");
    let listaUser = [];

    listaUser.push(data.split(";"));

    // número do CPF digitado
    let userCPF = req.body.nmUser;

    // verificador de user valido ou inválido
    let isValid = false;

    for (let i = 0; i < listaUser[0].length - 1; i++) {
        const element = listaUser[0][i];

        if (userCPF == element) {
            isValid = true;
            break
        }
    }

    // retorna a chave criptografada do usuário
    let userCript = criptografarUser(userCPF)

    let user: string

    // verificação se o tipo de votação é Anônima ou Não-anônima
    if (ehAnonima) {
        user = userCript
    } else {
        user = userCPF
    }

    // retorno do user para o frontend
    if (isValid) {
        res.send(user)

    } else {
        res.send(false)
    }
});

app.post("/voto", verificaVoto, function (req, resp) {
    let voto: string = req.body.eleitor + ";" + req.body.valueVoto + ";" + req.body.nameVoto + ";" + req.body.timestamp + "\n"

    fs.appendFile("votos.csv", voto, function (err) {
        if (err) {
            resp.json({
                "Status": "500",
                "Mensagem": "Erro ao registrar voto, contate o administrador do sistema"
            })
        } else {
            resp.json({
                "Status": "200",
                "Mensagem": "Voto Registrado Com sucesso"
            })
        }
    })
})

app.get("/config", async function (req, resp) {
    const config = await lerConfig()
    resp.json(config)
})


app.get("/apuracao", async function (req, resp) {
    let linhas = await apurarVotos();
    resp.send(linhas);
});

//-----------------------------FUNÇÕES-------------------------------

// Função que irá criptografar o CPF caso votação anônima
function criptografarUser(userCPF) {
    let userCript = sha256(userCPF);

    return userCript
}

//Função que vai verificar se o voto é repetido ou não e se está dentro do período de votação
async function verificaVoto(req, resp, next) {
    let verificaVoto1 = await verificaRepetido(req.body.eleitor)
    let verificaVoto2 = await verificaPrazoVoto(req.body.timestamp)
    if (verificaVoto1.validacao) {
        if (verificaVoto1.naoRepete && verificaVoto2) {
            next()
        } else {
            if (!verificaVoto1.naoRepete) {
                return resp.json({
                    "status": "401",
                    "mensagem": "Você só pode votar uma vez"
                })
            } else {
                return resp.json({
                    "status": "401",
                    "mensagem": "Voto fora do período de votação"
                })
            }
        }
    } else {
        return resp.json({
            "status": "500",
            "mensagem": "Erro ao ler arquivo"
        })
    }
}

async function verificaRepetido(eleitor: string) {
    try {
        let naoRepete = true
        let data = await fsPromises.readFile("votos.csv", "utf-8")
        let dados = data.split("\n")
        for (let i = 0; i < dados.length; i++) {
            let voto = dados[i].split(";")
            if (voto[0] == eleitor) {
                naoRepete = false
            }
        }
        return { validacao: true, naoRepete: naoRepete }
    } catch (err) {
        console.log(err);
        return { validacao: false }
    }
}

//3
async function criaVetorCandidatos(arquivoConfig: string) {
    let caminho = path.join("config_opcoes/", arquivoConfig)
    try {
        let dados = await fsPromises.readFile(caminho, "utf-8")
        let dadosCandidatos = dados.split("\r\n")
        let cand = []
        for (let i = 0; i < dadosCandidatos.length; i++) {
            let candidatoLinha = dadosCandidatos[i].split(";")
            candidatoLinha.splice(candidatoLinha.length - 1, 1)
            cand.push(candidatoLinha)
        }
        let candidatos = []

        if (cand[0].length == 2) {
            for (let index = 0; index < cand.length; index++) {
                let candidato = {
                    numCand: cand[index][0],
                    nomeCand: cand[index][1]
                }
                candidatos.push(candidato)
            }
        } else if (cand[0].length == 3) {
            for (let index = 0; index < cand.length; index++) {
                let candidato = {
                    numCand: cand[index][0],
                    nomeCand: cand[index][1],
                    imgCand: cand[index][2]
                }
                candidatos.push(candidato)
            }
        } else if (cand[0].length == 4) {
            for (let index = 0; index < cand.length; index++) {
                let candidato = {
                    numCand: cand[index][0],
                    nomeCand: cand[index][1],
                    imgCand: cand[index][2],
                    descCand: cand[index][3]
                }
                candidatos.push(candidato)
            }
        }
        return { validacao: true, candidatos: candidatos }


    } catch (err) {
        console.log(err);
        return { validacao: false }

    }
}

async function verificaPrazoVoto(timestampVoto) {
    const dataInicio = Number(Date.parse(inicioVotacao))
    const dataFim = Number(Date.parse(finalVotacao))
    const dataVoto = Number(Date.parse(timestampVoto))

    if(dataVoto > dataInicio && dataVoto < dataFim){
        return true
    }else{
        return false
    }
}

async function lerConfig(){
    try {
        let data = await fsPromises.readFile("configuracoes_gerais/config.csv", "utf-8")
        const configuracoes = data.split(";") 

        configuracoes.splice(configuracoes.length - 1, 1)

        inicioVotacao = configuracoes[1]
        finalVotacao = configuracoes[2]

        if (configuracoes[0] === "NA") {
            ehAnonima = false

        } else {
            ehAnonima = true
        }

        var candidatosDoConfig = await criaVetorCandidatos(configuracoes[3])
        if (candidatosDoConfig.validacao) {
            const configObj = {
                ehAnonima: ehAnonima,
                inicioVotacao: inicioVotacao,
                finalVotacao: finalVotacao,
                candidatos: candidatosDoConfig.candidatos
            }
            return { "status": 200, "resp": configObj }

        } else {
            return { "status": 500, "mensagem": "erro na leitura do arquivo" }
        }
    } catch (err) {
        return { "status": 500, "mensagem": "erro na leitura do arquivo" }
    }
}
