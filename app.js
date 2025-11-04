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
const controllerAtores = require('./controller/atores/controller_atores.js')
const controllerDiretores = require('./controller/diretores/controller_diretores.js')
const controllerProdutoras = require('./controller/produtora/controller_produtora.js')


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

//Função 04 - atualiza um gênero existente
app.put('/v1/locadora/genero/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o id do gênero
    let idGenero = request.params.id

    //Recebe os dados do body da requisição (Se voce utilizar o bodyparse, é obrigatório ter no endpoint)
    let dadosBody = request.body

    //Recebe o tipo de dados da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para atualizar no gênero, encaminha os dados e o content-type
    let genero = await controllerGenero.atualizarGenero(dadosBody, idGenero, contentType)

    response.status(genero.status_code)
    response.json(genero)
})

//Função 05 - exclui um gênero existente
app.delete('/v1/locadora/genero/:id', cors(), async function (request, response) {
    let idGenero = request.params.id

    let genero = await controllerGenero.excluirGenero(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})



//Endpoints para as rotas de atores

//Função 01 - retorna a lista de atores
app.get('/v1/locadora/atores', cors(), async function (request, response) {
    //Chama a função para listar atores do banco de dados
    let atores = await controllerAtores.listarAtores()
    response.status(atores.status_code)
    response.json(atores)
})

//Função 02 - retorna o ator filtrando pelo id
app.get('/v1/locadora/atores/:id', cors(), async function (request, response) {
    //Recebe o id encaminhado via parâmetro na requisição
    let idAtores = request.params.id

    //Chama a função para listar atores do banco de dados
    let atores = await controllerAtores.buscarAtorId(idAtores)
    response.status(atores.status_code)
    response.json(atores)
})

//Funçaõ 03 - insere um novo ator
app.post('/v1/locadora/atores', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body da requisição (Se voce utilizar o bodyparse, é obrigatório ter no endpoint)
    let dadosBody = request.body

    //Recebe o tipo de dados da requisição (JSON, XML ou outros formatos)
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir no atores, encaminha os dados e o content-type
    let atores = await controllerAtores.inserirAtor(dadosBody, contentType)

    response.status(atores.status_code)
    response.json(atores)
})

//Função 04 - atualiza um ator existente
app.put('/v1/locadora/atores/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o id do ator
    let idAtores = request.params.id

    //Recebe os dados do body da requisição (Se voce utilizar o bodyparse, é obrigatório ter no endpoint)
    let dadosBody = request.body

    //Recebe o tipo de dados da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para atualizar no ator, encaminha os dados e o content-type
    let atores = await controllerAtores.atualizarAtor(dadosBody, idAtores, contentType)

    response.status(atores.status_code)
    response.json(atores)
})

//Função 05 - exclui um ator existente
app.delete('/v1/locadora/atores/:id', cors(), async function (request, response) {
    let idAtores = request.params.id

    let atores = await controllerAtores.excluirAtor(idAtores)

    response.status(atores.status_code)
    response.json(atores)
})



//Endpoints para as rotas de diretores

//Função 01 - retorna a lista de diretores
app.get('/v1/locadora/diretores', cors(), async function (request, response) {
    //Chama a função para listar diretores do banco de dados
    let diretores = await controllerDiretores.listarDiretores()
    response.status(diretores.status_code)
    response.json(diretores)
})

//Função 02 - retorna o diretor filtrando pelo id
app.get('/v1/locadora/diretores/:id', cors(), async function (request, response) {
    //Recebe o id encaminhado via parâmetro na requisição
    let idDiretores = request.params.id

    //Chama a função para listar diretores do banco de dados
    let diretores = await controllerDiretores.buscarDiretorId(idDiretores)
    response.status(diretores.status_code)
    response.json(diretores)
})

//Funçaõ 03 - insere um novo diretor
app.post('/v1/locadora/diretores', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body da requisição (Se voce utilizar o bodyparse, é obrigatório ter no endpoint)
    let dadosBody = request.body

    //Recebe o tipo de dados da requisição (JSON, XML ou outros formatos)
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir no diretor, encaminha os dados e o content-type
    let diretores = await controllerDiretores.inserirDiretor(dadosBody, contentType)

    response.status(diretores.status_code)
    response.json(diretores)
})

//Função 04 - atualiza um diretor existente
app.put('/v1/locadora/diretores/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o id do diretor
    let idDiretores = request.params.id

    //Recebe os dados do body da requisição (Se voce utilizar o bodyparse, é obrigatório ter no endpoint)
    let dadosBody = request.body

    //Recebe o tipo de dados da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para atualizar no diretor, encaminha os dados e o content-type
    let diretores = await controllerDiretores.atualizarDiretor(dadosBody, idDiretores, contentType)

    response.status(diretores.status_code)
    response.json(diretores)
})

//Função 05 - exclui um diretor existente
app.delete('/v1/locadora/diretores/:id', cors(), async function (request, response) {
    let idDiretores = request.params.id

    let diretores = await controllerDiretores.excluirDiretor(idDiretores)

    response.status(diretores.status_code)
    response.json(diretores)
})



//Endpoints para as rotas de produtoras

//Função 01 - retorna a lista de produtoras
app.get('/v1/locadora/produtoras', cors(), async function (request, response) {
    //Chama a função para listar produtoras do banco de dados
    let produtoras = await controllerProdutoras.listarProdutora()
    response.status(produtoras.status_code)
    response.json(produtoras)
})

//Função 02 - retorna a produtora filtrando pelo id
app.get('/v1/locadora/produtoras/:id', cors(), async function (request, response) {
    //Recebe o id encaminhado via parâmetro na requisição
    let idProdutoras = request.params.id

    //Chama a função para listar diretores do banco de dados
    let produtoras = await controllerProdutoras.buscarProdutoraId(idProdutoras)
    response.status(produtoras.status_code)
    response.json(produtoras)
})

//Funçaõ 03 - insere uma nova produtora
app.post('/v1/locadora/produtoras', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body da requisição (Se voce utilizar o bodyparse, é obrigatório ter no endpoint)
    let dadosBody = request.body

    //Recebe o tipo de dados da requisição (JSON, XML ou outros formatos)
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir na produtora, encaminha os dados e o content-type
    let produtoras = await controllerProdutoras.inserirProdutora(dadosBody, contentType)

    response.status(produtoras.status_code)
    response.json(produtoras)
})

//Start na API
app.listen(PORT, function () {
    console.log('API aguardando requisições...')
})