/********************************************************************************************************
* Objetivo: Arquivo responsável pela manipulação e dados entre o app e a model para o crud de filmes.
* Data: 07/10/2025
* Autor: Rebeca Gomes
* Versão: 1.0 (CRUD básico do filme, sem as relações com outras tabelas)
* Versão: 1.1 (CRUD do filme com relacionamento com a tabela gênero)
*********************************************************************************************************/

//Import da model do DAO do filme
const { Prisma } = require('@prisma/client')
const filmeDAO = require('../../model/DAO/filme.js')

//Import da controller de relação entre filme e gênero
const controllerFilmeGenero = require('./controller_filme_genero.js')

//Import do arquivo de mensagens
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

//Retorna uma lista de todos os filmes
const listarFilmes = async function () {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Chama a função do DAO para retornar a lista de filmes do banco de dados
        let resultFilmes = await filmeDAO.getSelectAllMovies()

        if (resultFilmes) {
            if (resultFilmes.length > 0) {
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.DEFAULT_HEADER.items.filme = resultFilmes

                return MESSAGES.DEFAULT_HEADER //200
            } else {
                return MESSAGES.ERROR_NOT_FOUND //404
            }
        } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Retorna um filme filtrando pelo id
const buscarFilmeId = async function (id) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultFilmes = await filmeDAO.getSelectById(Number(id))

            if (resultFilmes) {
                if (resultFilmes.length > 0) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.items.filme = resultFilmes

                    return MESSAGES.DEFAULT_HEADER //200
                } else {
                    return MESSAGES.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += '[id incorreto!]'
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um filme
const inserirFilme = async function (filme, contentType) {

    //criando um novo objeto para modificar a mensagem padrão
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //chama a função de validação dos dados do filme
            let validar = await validarDadosFilme(filme)

            if (!validar) {
                //Processamento
                //chama a função do model para inserir um novo filme no BD
                let resultFilmes = await filmeDAO.setInsertMovies(filme)

                if (resultFilmes) {

                    //Chama a função para receber o ID gerado no Banco
                    let lastID = await filmeDAO.getSelectLastId()

                    
                    if (lastID) {

                          //Processar a inserção de dados na tabela de relação entre filme e gênero
                          //entre filme e Gênero

                          //subsituindo forEach por forOf para respeitar o tempo do async e retornar os nomes e IDs dos
                          for(genero of filme.genero){

                            let filmeGenero = {id_filme: lastID, id_genero: genero.id}

                            //Encaminha o JSON com o ID do filme e do gênero para a controller FilmeGenero
                            let resultFilmeGenero = await controllerFilmeGenero.inserirFilmeGenero(filmeGenero, contentType)

                            if(resultFilmeGenero.status_code != 201)
                                return MESSAGES.ERROR_RELATIONAL_INSERTION //500 Problema na tabela de relacionamento
                        }

                        //Adiciona o id no json com os dados do filme
                        filme.id = lastID
                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message

                        //Adicionar no JSON os dados do GENERO
                        delete filme.genero

                        let resultDadosGeneros = await controllerFilmeGenero.listarGenerosIdFilme(lastID)
                        //console.log(resultDadosGeneros.items.filme_genero)
                        
                        filme.genero = resultDadosGeneros.items.filmes_genero
                        //
                        MESSAGES.DEFAULT_HEADER.items = filme

                        return MESSAGES.DEFAULT_HEADER //201
                    } else {
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                    }

                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                }

            } else {
                return validar //400
            }

        } else {
            return MESSAGES.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Atualiza um filme filtrando pelo id
const atualizarFilme = async function (filme, id, contentType) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de requisição (Obrigatório ser um JSON)
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validar todos os dados filme
            let validar = await validarDadosFilme(filme)

            if (!validar) {
                //Validação para verificar se o id existe no banco de dados
                let validarId = await buscarFilmeId(id)

                if (validarId.status_code == 200) {
                    //Adiciona o id do filme no JSON de dados para ser encaminhada ao DAO
                    filme.id = Number(id)

                    //Chama a função para inserir um novo filme no banco de dados
                    let resultFilmes = await filmeDAO.setUpdateMovies(filme)

                    if (resultFilmes) {

                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCESS_UPDATED_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCESS_UPDATED_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCESS_UPDATED_ITEM.message
                        MESSAGES.DEFAULT_HEADER.items.filme = filme

                        return MESSAGES.DEFAULT_HEADER //200
                    } else {
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarId //A função buscarFilmeId poderá retornar 400, 404 ou 500
                }
            } else {
                return validar //400 referente a validação dos dados
            }
        } else {
            return MESSAGES.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Exclui um filme buscando pelo ID
const excluirFilme = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){

            //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
            let validarId = await buscarFilmeId(id)

            if(validarId.status_code == 200){

                let resultFilmes = await filmeDAO.setDeleteMovies(Number(id))

                if(resultFilmes){

                    MESSAGES.DEFAULT_HEADER.status          = MESSAGES.SUCESS_DELETED_ITEM.status
                    MESSAGES.DEFAULT_HEADER.status_code     = MESSAGES.SUCESS_DELETED_ITEM.status_code
                    MESSAGES.DEFAULT_HEADER.message         = MESSAGES.SUCESS_DELETED_ITEM.message
                    delete MESSAGES.DEFAULT_HEADER.items

                    return MESSAGES.DEFAULT_HEADER //200
                    
                }else{
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return MESSAGES.ERROR_NOT_FOUND //404
            }
        }else{
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        //console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Validação dos dados de cadastro e atualização do filme
const validarDadosFilme = async function (filme) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    //Validação de entrada de todos os atributo do filme
    if (filme.nome == '' || filme.nome == undefined || filme.nome == null || filme.nome.length > 100) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Nome incorreto]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (filme.sinopse == undefined) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Sinopse incorreta]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (filme.data_lancamento == undefined || filme.data_lancamento.length != 10) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Data lançamento incorreta]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (filme.duracao == '' || filme.duracao == undefined || filme.duracao == null || filme.duracao.length != 8) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Duração incorreta]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (filme.orcamento == '' || filme.orcamento == undefined || filme.orcamento == null || typeof (filme.orcamento) != 'number') {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Orçamento incorreto]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (filme.trailer == undefined || filme.trailer.length > 200) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Trailer incorreto]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (filme.capa == '' || filme.capa == undefined || filme.capa == null || filme.capa.length > 100) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Capa incorreta]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else {
        return false
    }
}

module.exports = {
    listarFilmes,
    buscarFilmeId,
    inserirFilme,
    atualizarFilme,
    excluirFilme
}