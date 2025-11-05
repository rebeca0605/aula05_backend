/********************************************************************************************************
* Objetivo: Arquivo responsável pela manipulação e dados entre o app e a model para o crud na relação entre filme e gênero.
* Data: 05/11/2025
* Autor: Rebeca Gomes
* Versão: 1.0
*********************************************************************************************************/

//Import da model do DAO do filme
const { Prisma } = require('@prisma/client')
const filmeGeneroDAO = require('../../model/DAO/filme_genero.js')

//Import do arquivo de mensagens
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

//Retorna uma lista de todos os gêneros
const listarFilmesGeneros = async function () {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Chama a função do DAO para retornar a lista de generos do banco de dados
        let resultFilmesGeneros = await filmeGeneroDAO.getSelectAllMoviesGenres()

        if (resultFilmesGeneros) {
            if (resultGeneros.length > 0) {
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCESS_REQUEST.status_code
                MESSAGES.DEFAULT_HEADER.items.filmes_genero = resultFilmesGeneros

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

//Retorna um gênero filtrando pelo id
const buscarFilmeGeneroId = async function (id) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultFilmesGeneros = await filmeGeneroDAO.getSelectByIdMoviesGenres(Number(id))

            if (resultFilmesGeneros) {
                if (resultFilmesGeneros.length > 0) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.items.filmes_genero = resultFilmesGeneros

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

//Retorna um gênero filtrando pelo filme
const listarGenerosIdFilme = async function (idFilme) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(idFilme) && idFilme != '' && idFilme != null && idFilme > 0) {
            let resultFilmesGeneros = await filmeGeneroDAO.getSelectGenresByIdMovies(Number(idFilme))

            if (resultFilmesGeneros) {
                if (resultFilmesGeneros.length > 0) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.items.filmes_genero = resultFilmesGeneros

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

//Retorna um gênero filtrando pelo filme
const listarFilmesIdGeneros = async function (idGenero) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(idGenero) && idGenero != '' && idGenero != null && idGenero > 0) {
            let resultFilmesGeneros = await filmeGeneroDAO.getSelectMoviesByIdGenre(Number(idGenero))

            if (resultFilmesGeneros) {
                if (resultFilmesGeneros.length > 0) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.items.filmes_genero = resultFilmesGeneros

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
const inserirFilmeGenero = async function (filmeGenero, contentType) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validar todos os dados filme
            let validar = await validarDadosFilmeGenero(filmeGenero)

            if (!validar) {

                //Processamento
                //Chama a função para inserir um novo filme no banco de dados
                let resultFilmesGeneros = await filmeGeneroDAO.setInsertMoviesGenres(filmeGenero)

                if (resultFilmesGeneros) {

                    //Chama a função para receber o id gerado no banco de dados
                    let lastId = await filmeGeneroDAO.getSelectLastId()
                    if (lastId) {

                        filmeGenero.id = lastId
                        MESSAGES.DEFAULT_HEADER.status          = MESSAGES.SUCESS_CREATED_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code     = MESSAGES.SUCESS_CREATED_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message         = MESSAGES.SUCESS_CREATED_ITEM.message
                        MESSAGES.DEFAULT_HEADER.items           = filmeGenero

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
const atualizarFilmeGenero = async function (filmeGenero, id, contentType) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de requisição (Obrigatório ser um JSON)
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validar todos os dados filme
            let validar = await validarDadosFilmeGenero(filmeGenero)

            if (!validar) {
                //Validação para verificar se o id existe no banco de dados
                let validarId = await buscarFilmeGeneroId(id)

                if (validarId.status_code == 200) {
                    //Adiciona o id do filme no JSON de dados para ser encaminhada ao DAO
                    filmeGenero.id = Number(id)

                    //Chama a função para inserir um novo filme no banco de dados
                    let resultFilmesGeneros = await filmeGeneroDAO.setUpdateMoviesGenres(filmeGenero)

                    if (resultFilmesGeneros) {

                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCESS_UPDATED_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCESS_UPDATED_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCESS_UPDATED_ITEM.message
                        MESSAGES.DEFAULT_HEADER.items.filmes_genero = filmeGenero

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
const excluirFilmeGenero = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){

            //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
            let validarId = await buscarFilmeGeneroId(id)

            if(validarId.status_code == 200){

                let resultFilmesGeneros = await filmeGeneroDAO.setDeleteMoviesGenres(Number(id))

                if(resultFilmesGeneros){

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
const validarDadosFilmeGenero = async function (filmeGenero) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    //Validação de entrada de todos os atributo do filme
    if (isNaN((filmeGenero.id_filme) ||  filmeGenero.id_filme <= 0 || filmeGenero.id_filme == '' || filmeGenero.id_filme == undefined || filmeGenero.id_filme == null)) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Id_filme incorreto]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }  else if(isNaN((filmeGenero.id_genero) ||  filmeGenero.id_genero <= 0 || filmeGenero.id_genero == '' || filmeGenero.id_genero == undefined || filmeGenero.id_genero == null)) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Id_genero incorreto]`
            return MESSAGES.ERROR_REQUIRED_FIELDS

    } else {
        return false
    }
}

module.exports = {
    listarFilmesGeneros,
    buscarFilmeGeneroId,
    listarGenerosIdFilme,
    listarFilmesIdGeneros,
    inserirFilmeGenero,
    atualizarFilmeGenero,
    excluirFilmeGenero,
    validarDadosFilmeGenero
}