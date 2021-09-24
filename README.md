Urna Eletrônica
=======


<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">

<img src="https://camo.githubusercontent.com/6cf9abe9d706421df40ff4feff208a5728df2b77f9eb21f24d09df00a0d69203/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f547970655363726970742d3030374143433f7374796c653d666f722d7468652d6261646765266c6f676f3d74797065736372697074266c6f676f436f6c6f723d7768697465">

---


Software desenvolvido para o projeto final da Academia JAVA: criado um sistema para votação online e apuração dos votos.

Este projeto tem como intuíto realizar, no lado do servidor, as configurações iniciais da votação, as validações do sistema, armazenar e realizar a apuração dos votos.

---

Sumário
=======

- Board do projeto
- Pré requisitos
- Instalando
  - Executar local
  - Acessar a aplicação
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

Para fazer e intalação basta clonar o projeto e dentro da pasta executar o comando:
```sh
npm install
```
O projeto pode ser executado da seguinte forma:

Executando o servidor local
--------------
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