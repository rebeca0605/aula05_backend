/********************************************************************************************************
* Objetivo: Arquivo responsável pelas requisiçõe pela API da loadora de filmes.
* Data: 07/10/2025
* Autor: Rebeca Gomes
* Versão: 1.0
*********************************************************************************************************/

const express = require('express') //Responsável pela API
const cors = require('cors') //Responsável pelas permissões da API (app)
const bodyParser = require('body-parser') //Responsável por gerenciar a chegada dos dados da API com o Front-End

//Cria um objeto especialista no formato JSON para receber dados via POST e PUT
const bodyParserJSON = bodyParser.json()

//Criando uma instância de uma classe do express
const app = express()

//Retorna a porta do sevidor atual ou colocamos uma porta local
const PORT = process.PORT || 8080

//Configuração de permissões
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*') //Servidor de origem da API
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPION') //Verbos permitidos da API (verbo são as requisições)

    //Carrega as configurações no cors da API 
    app.use(cors())
    next() // Próximo, carregar os próximos endpoints
})

//Import das controllers
const controllerFilme = require('./controller/filme/controller_filme.js')
const controllerGenero = require('./controller/genero/controller_genero.js')


//Endpoints para a rota de filmes

//Função 01 - retorna a lista de filmes
app.get('/v1/locadora/filme', cors(), async function (request, response) {
    //Chama a função para listar filmes do banco de dados
    let filme = await controllerFilme.listarFilmes()
    response.status(filme.status_code)
    response.json(filme)
})

//Função 02 - retorna o filme filtrando pelo id
app.get('/v1/locadora/filme/:id', cors(), async function (request, response) {
    //Recebe o id encaminhado via parâmetro na requisição
    let idFilme = request.params.id

    //Chama a função para listar filmes do banco de dados
    let filme = await controllerFilme.buscarFilmeId(idFilme)
    response.status(filme.status_code)
    response.json(filme)
})

//Funçaõ 03 - insere um novo filme
app.post('/v1/locadora/filme', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body da requisição (Se voce utilizar o bodyparse, é obrigatório ter no endpoint)
    let dadosBody = request.body

    //Recebe o tipo de dados da requisição (JSON, XML ou outros formatos)
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir no filme, encaminha os dados e o content-type
    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

//Função 04 - atualiza um filme existente
app.put('/v1/locadora/filme/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o id do filme
    let idFilme = request.params.id

    //Recebe os dados do body da requisição (Se voce utilizar o bodyparse, é obrigatório ter no endpoint)
    let dadosBody = request.body

    //Recebe o tipo de dados da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para atualizar no filme, encaminha os dados e o content-type
    let filme = await controllerFilme.atualizarFilme(dadosBody, idFilme, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

//Função 05 - exclui um filme existente
app.delete('/v1/locadora/filme/:id', cors(), async function (request, response) {
    let idFilme = request.params.id

    let filme = await controllerFilme.excluirFilme(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})


//Endpoints para as rotas de generos

//Função 01 - retorna a lista de gêneros
app.get('/v1/locadora/genero', cors(), async function (request, response) {
    //Chama a função para listar gêneros do banco de dados
    let genero = await controllerGenero.listarGeneros()
    response.status(genero.status_code)
    response.json(genero)
})

//Função 02 - retorna o gênero filtrando pelo id
app.get('/v1/locadora/genero/:id', cors(), async function (request, response) {
    //Recebe o id encaminhado via parâmetro na requisição
    let idGenero = request.params.id

    //Chama a função para listar gêneros do banco de dados
    let genero = await controllerGenero.buscarGeneroId(idGenero)
    response.status(genero.status_code)
    response.json(genero)
})

//Funçaõ 03 - insere um novo gênero
app.post('/v1/locadora/genero', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body da requisição (Se voce utilizar o bodyparse, é obrigatório ter no endpoint)
    let dadosBody = request.body

    //Recebe o tipo de dados da requisição (JSON, XML ou outros formatos)
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir no gênero, encaminha os dados e o content-type
    let genero = await controllerGenero.inserirGenero(dadosBody, contentType)

    response.status(genero.status_code)
    response.json(genero)
})

//Função 04 - atualiza um filme existente
app.put('/v1/locadora/genero/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o id do gênero
    let idGenero = request.params.id

    //Recebe os dados do body da requisição (Se voce utilizar o bodyparse, é obrigatório ter no endpoint)
    let dadosBody = request.body

    //Recebe o tipo de dados da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para atualizar no filme, encaminha os dados e o content-type
    let genero = await controllerGenero.atualizarGenero(dadosBody, idGenero, contentType)

    response.status(genero.status_code)
    response.json(genero)
})

//Start na API
app.listen(PORT, function () {
    console.log('API aguardando requisições...')
})