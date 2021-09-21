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

app.post("/voto", verificaVoto, function(req,resp){
    let voto = req.body.eleitor + ";" + req.body.valueVoto + ";" + req.body.nameVoto + ";" + req.body.timestamp + "\n"

    fs.appendFile("votos.csv", voto, function(err){
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

//Função que vai verificar se o voto é repetido ou não e se está dentro do período de votação
function verificaVoto(req, resp, next){
    let votoUnico = verificaRepetido(req.eleitor)
    let votoNoPrazo = verificaPrazoVoto(req.timestamp)
    if(votoUnico && votoNoPrazo){
        next()
    }else{
        if(!votoUnico){
            return resp.json({
                "status": "401",
                "mensagem": "Você só pode votar uma vez"
            })
        }else{
            return resp.json({
                "status": "401",
                "mensagem": "Voto fora do período de votação"
            })            
        }
    }
}