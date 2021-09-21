import * as express from "express";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import * as cors from "cors";
import { readFileSync } from 'fs';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());
const porta = 3001;

app.listen(porta, function () {
  console.log("Servidor rodando na porta " + porta);
});

app.get("/validaUsuario",  function (req, res) {
  const data = readFileSync("./opcoes_usuarios/usuariosRG.csv", "utf-8");
  res.json({ data })
});

