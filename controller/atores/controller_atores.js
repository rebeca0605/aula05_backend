/********************************************************************************************************
* Objetivo: Arquivo responsável pela manipulação e dados entre o app e a model para o crud de atores.
* Data: 04/11/2025
* Autor: Rebeca Gomes
* Versão: 1.0
*********************************************************************************************************/

//Import da model do DAO do filme
const { Prisma } = require('@prisma/client')
const atoresDAO = require('../../model/DAO/atores.js')

//Import do arquivo de mensagens
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

//Retorna uma lista de todos os atores
const listarAtores = async function () {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Chama a função do DAO para retornar a lista de atores do banco de dados
        let resultAtores = await atoresDAO.getSelectAllActors()

        if (resultAtores) {
            if (resultAtores.length > 0) {
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.DEFAULT_HEADER.items.atores = resultAtores

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

//Retorna um ator filtrando pelo id
const buscarAtorId = async function (id) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultAtores = await atoresDAO.getActorById(Number(id))

            if (resultAtores) {
                if (resultAtores.length > 0) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.items.atores = resultAtores

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

//Insere um ator
const inserirAtor = async function (ator, contentType) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validar todos os dados do ator
            let validar = await validarDadosAtor(ator)

            if (!validar) {

                //Processamento
                //Chama a função para inserir um novo ator no banco de dados
                let resultAtores = await atoresDAO.setInsertActors(ator)

                if (resultAtores) {

                    //Chama a função para receber o id gerado no banco de dados
                    let lastId = await atoresDAO.getSelectLastId(ator)
                    if (lastId) {

                        ator.id = lastId
                        MESSAGES.DEFAULT_HEADER.status          = MESSAGES.SUCESS_CREATED_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code     = MESSAGES.SUCESS_CREATED_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message         = MESSAGES.SUCESS_CREATED_ITEM.message
                        MESSAGES.DEFAULT_HEADER.items           = ator

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

//Atualiza um ator filtrando pelo id
const atualizarAtor = async function (ator, id, contentType) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de requisição (Obrigatório ser um JSON)
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validar todos os dados do ator
            let validar = await validarDadosAtor(ator)

            if (!validar) {
                //Validação para verificar se o id existe no banco de dados
                let validarId = await buscarAtorId(id)

                if (validarId.status_code == 200) {
                    //Adiciona o id do ator no JSON de dados para ser encaminhada ao DAO
                    ator.id = Number(id)

                    //Chama a função para inserir um novo ator no banco de dados
                    let resultAtores = await atoresDAO.setUpdateActors(ator)

                    if (resultAtores) {

                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCESS_UPDATED_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCESS_UPDATED_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCESS_UPDATED_ITEM.message
                        MESSAGES.DEFAULT_HEADER.items.ator = ator

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

//Exclui um ator buscando pelo ID
const excluirAtor = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){

            //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
            let validarId = await buscarAtorId(id)

            if(validarId.status_code == 200){

                let resultAtores = await atoresDAO.setDeleteActors(Number(id))

                if(resultAtores){

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

//Validação dos dados de cadastro e atualização dos atores
const validarDadosAtor = async function (ator) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    //Validação de entrada de todos os atributo do ator
    if (ator.nome == '' || ator.nome == undefined || ator.nome == null || ator.nome.length > 100) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Nome incorreto]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (ator.nome_artistico.length > 100) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Nome artístico incorreto]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (ator.data_nascimento == undefined || ator.data_nascimento.length != 10) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Data de nascmento incorreta]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (ator.nacionalidade.length > 100) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Nacionalidade incorreto]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (ator.biografia.length > 500) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Biografia incorreta]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (ator.foto == '' || ator.foto == undefined || ator.foto == null || ator.foto.length > 100) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Foto incorreta]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else {
        return false
    }
}

module.exports = {
    listarAtores,
    buscarAtorId,
    inserirAtor,
    atualizarAtor,
    excluirAtor
}