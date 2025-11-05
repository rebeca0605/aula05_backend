/****************************************************************************************
* Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente dos produtora.
* Data: 04/11/2025
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

//Retorna uma lista de todos as produtoras do banco de dados
const getSelectAllProdutoras = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_produtora order by id_produtora desc`

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

//Retorna uma produtora filtrando pelo id do banco de dados
const getProdutoraById = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_produtora where id_produtora=${id}`

        //Encaminha para o banco de dados o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

//Insere uma produtora novo no banco de dados
const setInsertProdutora = async function (produtora) {
    try {
        let sql = `INSERT INTO tbl_produtora (nome, 
                        nome_fantasia, 
                        pais_origem, 
                        data_fundacao, 
                        site, 
                        descricao,
                        ativa)
                    VALUES('${produtora.nome}', 
                            '${produtora.nome_fantasia}', 
                            '${produtora.pais_origem}',
                            '${produtora.data_fundacao}',
                            '${produtora.site}',
                            '${produtora.descricao}'),
                            '${produtora.ativa}')`

        let result = await prisma.$executeRawUnsafe(sql)
        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

//Altera uma produtora no banco de dados
const setUpdateProdutora = async function (produtora) {
    try {

        let sql = `update tbl_produtora set
                        nome                = '${produtora.nome}', 
                        nome_fantasia       = '${produtora.nome_artistico}', 
                        pais_origem         = '${produtora.data_nascimento}', 
                        data_fundacao       = '${produtora.nacionalidade}',
                        site                = '${produtora.biografia}', 
                        descricao           = '${produtora.biografia}', 
                        ativa               = '${produtora.foto}'
        
                    where id_produtora = ${produtora.id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        //console.log(error)
        return false
    }
}

//Retorna o último id gerado no banco de dados
const getSelectLastId = async function(){
    try {
        //Script sql para retornar apenas o último id do banco
        let sql = `select id_produtora from tbl_produtora order by id_produtora desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].id_produtora)
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllProdutoras,
    getProdutoraById,
    setInsertProdutora,
    setUpdateProdutora,
    getSelectLastId
}