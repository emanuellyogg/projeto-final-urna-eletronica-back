import * as express from "express";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import * as cors from "cors";
import { readFileSync } from "fs";


const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());
const porta = 3001;

app.listen(porta, function () {
  console.log("Servidor rodando na porta " + porta);
});

//-------------------------VARIÁVEIS---------------------------------

var inicioVotacao: string
var finalVotacao: string
var ehAnonima: boolean

//------------------------------ROTAS--------------------------------

// Rota que busca validar o usuário logado
app.get("/validaUsuario", function (req, res) {
  const data = readFileSync("./opcoes_usuarios/usuarios.csv", "utf-8");
  let listaUser = [];

  listaUser.push(data.split(";"));

  // número do CPF digitado
  let user = req.body.nmUser; 
  console.log(typeof listaUser);

  // verificador de user valido ou inválido
  let isValid = false;

  for (let i = 0; i < listaUser[0].length - 1; i++) {
    const element = listaUser[0][i];
    
    if (user == element) {
      isValid = true;
      break
    } 
  }
    
  // retorno para o frontend
  if (isValid) {
    res.send(true)
    
  } else {
    res.send(false)
  }
});

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

//-----------------------------FUNÇÕES-------------------------------

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
