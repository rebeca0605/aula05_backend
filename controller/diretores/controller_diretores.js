/********************************************************************************************************
* Objetivo: Arquivo responsável pela manipulação e dados entre o app e a model para o crud de diretores.
* Data: 04/11/2025
* Autor: Rebeca Gomes
* Versão: 1.0
*********************************************************************************************************/

//Import da model do DAO do filme
const { Prisma } = require('@prisma/client')
const diretoresDAO = require('../../model/DAO/diretores.js')

//Import do arquivo de mensagens
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

//Retorna uma lista de todos os diretores
const listarDiretores = async function () {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Chama a função do DAO para retornar a lista de diretores do banco de dados
        let resultDiretores = await diretoresDAO.getSelectAllDirectors()

        if (resultDiretores) {
            if (resultDiretores.length > 0) {
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCESS_REQUEST.status_code
                MESSAGES.DEFAULT_HEADER.items.diretores = resultDiretores

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

//Retorna um diretor filtrando pelo id
const buscarDiretorId = async function (id) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultDiretores = await diretoresDAO.getDirectorById(Number(id))

            if (resultDiretores) {
                if (resultDiretores.length > 0) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.items.diretores = resultDiretores

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

//Insere um diretor
const inserirDiretor = async function (diretor, contentType) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validar todos os dados do diretor
            let validar = await validarDadosDiretor(diretor)

            if (!validar) {

                //Processamento
                //Chama a função para inserir um novo diretor no banco de dados
                let resultDiretores = await diretoresDAO.setInsertDirectors(diretor)

                if (resultDiretores) {

                    //Chama a função para receber o id gerado no banco de dados
                    let lastId = await diretoresDAO.getSelectLastId(diretor)
                    if (lastId) {

                        diretor.id = lastId
                        MESSAGES.DEFAULT_HEADER.status          = MESSAGES.SUCESS_CREATED_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code     = MESSAGES.SUCESS_CREATED_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message         = MESSAGES.SUCESS_CREATED_ITEM.message
                        MESSAGES.DEFAULT_HEADER.items           = diretor

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

//Atualiza um diretor filtrando pelo id
const atualizarDiretor = async function (diretor, id, contentType) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de requisição (Obrigatório ser um JSON)
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validar todos os dados do diretor
            let validar = await validarDadosDiretor(diretor)

            if (!validar) {
                //Validação para verificar se o id existe no banco de dados
                let validarId = await buscarDiretorId(id)

                if (validarId.status_code == 200) {
                    //Adiciona o id do diretor no JSON de dados para ser encaminhada ao DAO
                    diretor.id = Number(id)

                    //Chama a função para inserir um novo ator no banco de dados
                    let resultDiretores = await diretoresDAO.setUpdateDirectors(diretor)

                    if (resultDiretores) {

                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCESS_UPDATED_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCESS_UPDATED_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCESS_UPDATED_ITEM.message
                        MESSAGES.DEFAULT_HEADER.items.diretor = diretor

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

//Exclui um diretor buscando pelo ID
const excluirDiretor = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){

            //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
            let validarId = await buscarDiretorId(id)

            if(validarId.status_code == 200){

                let resultDiretores = await diretoresDAO.setDeleteDirectors(Number(id))

                if(resultDiretores){

                    MESSAGES.DEFAULT_HEADER.status          = MESSAGES.SUCESS_DELETED_ITEM.status
                    MESSAGES.DEFAULT_HEADER.status_code     = MESSAGES.SUCESS_DELETED_ITEM.status_code
                    MESSAGES.DEFAULT_HEADER.message         = MESSAGES.SUCESS_DELETED_ITEM.message
                    MESSAGES.DEFAULT_HEADER.items.diretor     = resultDiretores

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

//Validação dos dados de cadastro e atualização dos diretores
const validarDadosDiretor = async function (diretor) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    //Validação de entrada de todos os atributo do diretor
    if (diretor.nome == '' || diretor.nome == undefined || diretor.nome == null || diretor.nome.length > 100) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Nome incorreto]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (diretor.nome_artistico.length > 100) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Nome artístico incorreto]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (diretor.data_nascimento == undefined || diretor.data_nascimento.length != 10) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Data de nascmento incorreta]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (diretor.nacionalidade.length > 100) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Nacionalidade incorreto]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (diretor.biografia.length > 500) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Biografia incorreta]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (diretor.foto == '' || diretor.foto == undefined || diretor.foto == null || diretor.foto.length > 100) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += `[Foto incorreta]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else {
        return false
    }
}

module.exports = {
    listarDiretores,
    buscarDiretorId,
    inserirDiretor,
    atualizarDiretor,
    excluirDiretor,
    validarDadosDiretor
}