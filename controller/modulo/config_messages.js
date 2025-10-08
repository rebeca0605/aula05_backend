/****************************************************************************************
* Objetivo: Arquivo responsável pelo padrão de mensagens que o projeto irá realizar, 
            sempre no formato json (mensagens de erro e sucesso)
* Data: 07/10/2025
* Autor: Rebeca Gomes
* Versão: 1.0
*****************************************************************************************/

//Cria um objeto da classe date para pegar a data atual
const dateAtual = new Date()

/******************************* MENSAGENS PADRONIZADAS *******************************/
const DEFAULT_HEADER = {development: 'Rebeca Gomes', 
                        api_description: 'API para manipular dados dos filmes.',
                        status: Boolean,
                        status_code: Number,
                        request_date: dateAtual.toLocaleString(),
                        items: {}
                        }

/******************************* MENSAGENS DE SUCESSO *******************************/
const SUCESS_REQUEST = {status: true, status_code: 200, message: 'Requisição bem sucedida!'}

/******************************* MENSAGENS DE ERRO *********************************/
const ERROR_NOT_FOUND                   = {status: false, status_code: 404, message: 'Não foram encontrados dados de retorno!'}
const ERROR_INTERNAL_SERVER_CONTROLLER  = {status: false, status_code: 500, message: 'Não foi possível processar a requisição, devido a erros internos no servidor (controller)!'}
const ERROR_INTERNAL_SERVER_MODEL       = {status: false, status_code: 500, message: 'Não foi possível processar a requisição, devido a erros internos no servidor (modelagem de dados)!'}
const ERROR_REQUIRED_FIELDS             = {status: false, status_code: 400, message: 'Não foi possível processar a requisição, pois existem campos obrigatórios que devem ser encaminhados e atendidos conforme a documentação!'}

module.exports = {
    DEFAULT_HEADER,
    SUCESS_REQUEST,
    ERROR_NOT_FOUND,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_REQUIRED_FIELDS
}