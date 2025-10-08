/****************************************************************************************
* Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente o filme.
* Data: 01/10/2025
* Autor: Rebeca Gomes
* Versão: 1.0
*****************************************************************************************/

/*
Exemplos de dependências(bibliotecas) para conexão com o banco de dados:
 Bancos de dados relacionais:
    Sequelize -> foi utilizado em muitos projetos desde o início do node.
    Prisma -> é uma dependência atual que trabalha com o banco de dados ( MySQL, PostgreSQL, SQL Server)(SQL ou ORM).
                    npm prisma --save                           ->          instalar o prisma (conexão com o banco de dados).
                    npm install @prisma/client --save           ->          instalar o cliente do prisma (executar scripts SQL no Banco de dados).
                    npx prisma init                             ->          prompt de comando para inicializar o risma no projeto.
                    npx prisma migrate dev                      ->          realiza o sincronismo entre o prisma e o banco de dados
                                                                            (cuidado! nesse processo você poderá perder os dados do banco, pois ele cria as tabelas 
                                                                            programadas no oRM schema.prisma)
                    npx prisma generate                         ->          apenas realiza o sincronismo entre o prisma e o banco de dados, geralmente usamos para 
                                                                            rodar o projeto em um pc novo.

    Knex -> é uma dependência atul que trabalha co MySQL

 Banco de dados não relacional: 
    Mongoose -> é uma dependência para o Mongo DB (Não relacional).
*/

//Import da dependência do prisma que permite a execução de script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Cria um novo objeto baseado na classe PrismaClient
const prisma = new PrismaClient()

//$queryRawUnsafe() -> permite executar um script sql de uma variável que retorna valores do banco (SELECT).
//$executeRawUnsafe() -> permite executar um script sql de uma variável que não retorna dados do banco (INSERT, UPDATE e DELETE).
//$queryRaw() -> permite executar um script sql sem estar em uma variável que retorna valores do banco (SELECT) e faz tratamentos de seguança contra SQL Inject.
//$executeRaw() -> permite executar um script sql sem estar em uma variável que não retorna dados do banco (INSERT, UPDATE e DELETE)  e faz tratamentos de seguança contra SQL Inject.

//Retorna uma lista de todos os filmes do bamco de dados
const getSelectAllMovies = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_filme order by id_filme desc`

        //Encaminha para o banco de dados o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        //console.log(error)
        return false
    }
}


//Retorna um filme filtrando pelo id do banco de dados
const getSelectById = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_filme where id_filme=${id}`
        
        //Encaminha para o banco de dados o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        //console.log(error)
        return false
    }
}

//Insere um filme novo no banco de dados
const setInsertMovies = async function () {

}

//Altera um filme no banco de dados
const setUpdateMovies = async function (id) {

}

//Exclui um filme pelo id no banco de dados
const setDeleteMovies = async function (id) {

}

module.exports = {
    getSelectAllMovies,
    getSelectById
}