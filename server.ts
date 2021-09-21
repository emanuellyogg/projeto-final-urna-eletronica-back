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

app.get("/config", async function(req, resp) {

    fs.readFile("configuracoes_gerais/config.csv", "utf-8", function(err, data) {
        
        const configuracoes = data.split(";") //split = dividir
        console.log(configuracoes);
          
        configuracoes.splice(configuracoes.length - 1, 1) //splice=juntar

        //2 criaçao das variaveis globais
        inicioVotacao = configuracoes[1]
        finalVotacao = configuracoes[2]

        //var candidatos = await criaVetorCandidatos(configuracoes[3])

        resp.send(configuracoes)
        //1 neste momento compilo para o js, abro o servidor npm server.js e abre o postman

  
    })
})


