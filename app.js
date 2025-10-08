/********************************************************************************************************
* Objetivo: Arquivo responsável pelas requisiçõe pela API da loadora de filmes.
* Data: 07/10/2025
* Autor: Rebeca Gomes
* Versão: 1.0
*********************************************************************************************************/

const express = require('express') //Responsável pela API
const cors = require('cors') //Responsável pelas permissões da API (app)
const bodyParser = require('body-parser') //Responsável por gerenciar a chegada dos dados da API com o Front-End

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

//Endpoints para a rota de filmes

//Função 01
app.get('/v1/locadora/filme', cors(), async function(request, response) {
    //Chama a função para listar filmes do banco de dados
    let filme = await controllerFilme.listarFilmes()
    response.status(filme.status_code)
    response.json(filme)
})

//Função 02
app.get('/v1/locadora/filme/:id', cors(), async function(request, response) {
    //Recebe o id encaminhado via parâmetro na requisição
    let idFilme = request.params.id

    //Chama a função para listar filmes do banco de dados
    let filme = await controllerFilme.buscarFilmeId(idFilme)
    response.status(filme.status_code)
    response.json(filme)
})

//Start na API
app.listen(PORT, function(){
    console.log('API aguardando requisições...')
})