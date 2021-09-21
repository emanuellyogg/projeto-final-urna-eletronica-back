import * as express from "express"
import * as fs from "fs"
import * as fsPromises from 'fs/promises'
import * as jwt from "jsonwebtoken"
import * as path from "path"
import * as cors from "cors"

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cors());
const porta = 3001;

app.listen(porta, function () { })

var inicioVotacao: string
var finalVotacao: string
var ehAnonima: boolean

app.get("/config", function(req, resp) {

    fs.readFile("configuracoes_gerais/config.csv", "utf-8", async function(err, data) {
        
        const configuracoes = data.split(";") //split = dividir
        console.log(configuracoes);
          
        configuracoes.splice(configuracoes.length - 1, 1) //splice=juntar

        //2 criaçao das variaveis globais
        inicioVotacao = configuracoes[1]
        finalVotacao = configuracoes[2]

        if (configuracoes[0] == "NA") {
            ehAnonima = false
                
        }else{
            ehAnonima = true
        }

        var candidatosObj = await criaVetorCandidatos(configuracoes[3])
        if (candidatosObj.validacao) {
            const resposta = {
                ehAnonima: ehAnonima,
                inicioVotacao: inicioVotacao,
                finalVotacao: finalVotacao,
                candidatos: candidatosObj.candidatos
            }
            resp.json(resposta)

        }else if(candidatosObj.validacao == false || err ){
            resp.json({"status": 500, "mensagem": "erro na leitura do arquivo"})

        }
        
        //resp.send(configuracoes)
        //1 neste momento compilo para o js, abro o servidor npm server.js e abre o postman

    })
})

//3
async function criaVetorCandidatos(arquivoConfig:string) {
    let caminho = path.join("config_opcoes/", arquivoConfig)
    try{
        let dados = await fsPromises.readFile(caminho, "utf-8")
        let dadosCandidatos = dados.split("\r\n")
        let cand = []
        for (let i = 0; i < dadosCandidatos.length; i++) {
            let candidatoLinha = dadosCandidatos[i].split(";")
            candidatoLinha.splice(candidatoLinha.length -1, 1)
            cand.push(candidatoLinha)
        }
        let candidatos = []

        if (cand[0].length == 2) {
            for (let index = 0; index < cand.length; index++) {
               let candidato = {
                   numCand: cand [index][0],
                   nomeCand: cand [index][1]
               }
            candidatos.push(candidato)   
            }
        }else if(cand[0].length == 3) {
            for (let index = 0; index < cand.length; index++) {
               let candidato = {
                   numCand: cand [index][0],
                   nomeCand: cand [index][1],
                   imgCand: cand [index][2]
               }
            candidatos.push(candidato)   
            }
        }else if (cand[0].length == 4) {
            for (let index = 0; index < cand.length; index++) {
               let candidato = {
                   numCand: cand [index][0],
                   nomeCand: cand [index][1],
                   imgCand: cand [index][2],
                   descCand: cand [index][3]
               }
            candidatos.push(candidato)   
            }
        }
        return {validacao: true, candidatos: candidatos}


    }catch(err){
        console.log(err);
        return {validacao: false}
        
    }
    
    
}


