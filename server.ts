import express from "express"
import fs from "fs"
import fsPromises from 'fs/promises'
import jwt from "jsonwebtoken"
import path from "path"
import cors from "cors"

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cors());
const porta = 3001;

app.listen(porta, function () { })