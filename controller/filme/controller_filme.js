/********************************************************************************************************
* Objetivo: Arquivo responsável pela manipulação e dados entre o app e a model para o crud de filmes.
* Data: 07/10/2025
* Autor: Rebeca Gomes
* Versão: 1.0
*********************************************************************************************************/

//Import da model do DAO do filme
const { Prisma } = require('@prisma/client')
const filmeDAO = require('../../model/DAO/filme.js')

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
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCESS_REQUEST.status_code
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
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCESS_REQUEST.status_code
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
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validar todos os dados filme
            let validar = await validarDadosFilme(filme)

            if (!validar) {

                //Processamento
                //Chama a função para inserir um novo filme no banco de dados
                let resultFilmes = await filmeDAO.setInsertMovies(filme)

                if (resultFilmes) {

                    //Chama a função para receber o id gerado no banco de dados
                    let lastId = await filmeDAO.getSelectLastId()
                    if (lastId) {

                        filme.id = lastId
                        MESSAGES.DEFAULT_HEADER.status          = MESSAGES.SUCESS_CREATED_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code     = MESSAGES.SUCESS_CREATED_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message         = MESSAGES.SUCESS_CREATED_ITEM.message
                        MESSAGES.DEFAULT_HEADER.items           = filme

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
                    MESSAGES.DEFAULT_HEADER.items.filme     = resultFilmes

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