Urna Eletrônica
=======


![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) 

![Sonar](./measure.svg)

---


Software desenvolvido para o projeto final da Academia JAVA: criado um sistema para votação online e apuração dos votos.

Este projeto tem como intuíto realizar, no lado do servidor, as configurações iniciais da votação, as validações do sistema, armazenar e realizar a apuração dos votos.

---

Sumário
=======

- Board do projeto
- Pré requisitos
- Instalando
  - Executando o servidor local
- Dependências do projeto

---

Board do projeto
================
Para acessar o board do projeto [clique aqui](https://senju.atlassian.net/jira/software/projects/UE/boards/4).

---

Pré requisitos
==========
Instalar o Node.js. Para mais informações de como instalar [clique aqui](https://nodejs.org/en/); <br>

---

# Instalando

Utilizando nesse formato, as alterações serão executadas automaticamente e refletidas na aplicação.

Para fazer a intalação basta clonar o projeto, executando o comando:

```sh
git clone https://larisgou@bitbucket.org/emanuellyogg/urna-eletronica-backend.git
```

E, dentro da pasta executar o comando:
```sh
npm install
```


Executando o servidor local
--------------

Na pasta raiz do projeto, executar o comando:

```sh
npm run start
```

---

Dependências do projeto
=======================
| Nome                                                               | Objetivo                             |
| ------------------------------------------------------------------ | ------------------------------------ |
| [express](https://www.npmjs.com/package/express)                            | Especificar qual função é chamada quando chega requisição HTTP (GET, POST, SET, etc.)                  |
| [js-sha256](https://www.npmjs.com/package/js-sha256)       | Criar chaves de criptografia                     |
| [fs](https://nodejs.org/api/fs.html)       |  Interagir com os arquivos do projeto