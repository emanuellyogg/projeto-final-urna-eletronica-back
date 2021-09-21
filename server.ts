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
