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
    let voto:string = req.body.eleitor + ";" + req.body.valueVoto + ";" + req.body.nameVoto + ";" + req.body.timestamp + "\n"

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
async function verificaVoto(req, resp, next){
    let verificaVoto1 = await verificaRepetido(req.body.eleitor)
    console.log(verificaVoto1);
    
    //let verificaVoto2 = await verificaPrazoVoto(req.body.timestamp)
    if(verificaVoto1.validacao){ //&& verificaVoto2.validacao){
        if(verificaVoto1.naoRepete){//&& verificaVoto2.validacao){
            next()
        }else{
            if(!verificaVoto1.naoRepete){
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
    }else{
        return resp.json({
            "status": "500",
            "mensagem": "Erro ao ler arquivo"
        })  
    }
}

async function verificaRepetido(eleitor){
    try{
        let naoRepete = true
        let data = await fsPromises.readFile("votos.csv", "utf-8")
        let dados = data.split("\n")
        for(let i=0; i < dados.length; i++){
            let voto = dados[i].split(";")
            if(voto[0] == eleitor){
                naoRepete = false
            }
        }
        return {validacao: true, naoRepete: naoRepete}
    }catch(err){
        console.log(err);        
        return {validacao: false}
    }
}