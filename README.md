# Trybe futebol Club

Trybe Futebol Clube é um website de partidas e classificações de futebol, onde é possível buscar, cadastrar e editar partidas e verificar as classificações geral, como mandante e como visitante de cada time.

Neste projeto, foi construído uma API com as regras de negócio da aplicação e que é consumida pelo Front-End provido pela Trybe. Além disso, a aplicação está dockerizada e o código foi desenvolvido utilizando o método de Desenvolvimento Orientado a Testes, ou TDD (Test Driven Development).


## Tecnologias
O Back-End foi desenvolvido em [Node.js](https://nodejs.org/) com [TypeScript](https://www.typescriptlang.org/), utilizando o framework [Express](https://expressjs.com/), o banco de dados [MySQL](https://www.mysql.com/) e o Object-Relational Mapper (ORM) [Sequelize](https://sequelize.org/). Além disso, a autenticação do usuário é realizada através de [JSON Web Tokens (JWT)](https://jwt.io/), que são fornecidos ao realizar o login, e a senha do usuário é criptografada usando [bcrypt](https://en.wikipedia.org/wiki/Bcrypt).

Nos testes de integração, foram utilizados [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/) e [Sinon](https://sinonjs.org/).
## Atenção
Esse projeto utiliza variáveis de ambiente. Renomeie o arquivo `.env.example` para `.env` e altere os valores de acordo com suas próprias configurações.
## Iniciando a aplicação com Docker

* Clonando o projeto

    ```bash
    git clone git@github.com:marllomartin/trybe-futebol-clube.git

    cd trybe-futebol-clube

    cd app
    ```
    
* Inicializa o docker

    ```bash
    docker-compose up --build
    ```
* Instalando as dependencias do Front-end
     ```bash
    cd frontend

    npm install 
    ```

* Instalando as dependencias do Back-end
    ```bash
    cd frontend

    npm install 
    ```
* Inicializa e popula o banco de dados

    ```bash 
    npx sequelize db:create && npx sequelize db:seed:all
    ```

* Inicializa o servidor dentro da pasta `backend`:

    ```bash
    npm run dev
    ``` 
* Inicializa o front dentro da pasta `frontend``
     ```bash
     npm start
     ```
## Aprendizados

* Planejamento de um CRUD com Node.js e TypeScript;

* Utilização do paradigma de Programação Orientada a Objetos ;

* Desenvolvimento TDD (Test Driven Development);

* Processos de autenticação de JWT;

* Organização de Dockerfiles;

* Orquestração de containers com o Docker Compose;
## Executando os testes:

Em um novo terminal, aninda dentro da pasta `app` execute

```bash
 docker compose exec backend npm test
```

Verificando a cobertura de código, execute:

```bash
docker compose exec backend npm run test:coverage
```
## Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  npm run test
```