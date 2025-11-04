/****************************************************************************************
* Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente dos diretores.
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

//Retorna uma lista de todos os diretores do banco de dados
const getSelectAllDirectors = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_diretores order by id_diretores desc`

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

//Retorna um diretor filtrando pelo id do banco de dados
const getDirectorById = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_diretores where id_diretores=${id}`

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

//Insere um diretor novo no banco de dados
const setInsertDirectors = async function (diretor) {
    try {
        let sql = `INSERT INTO tbl_diretores (nome, 
                        nome_artistico, 
                        data_nascimento, 
                        nacionalidade, 
                        biografia, 
                        foto)
                    VALUES('${diretor.nome}', 
                            '${diretor.nome_artistico}', 
                            '${diretor.data_nascimento}',
                            '${diretor.nacionalidade}',
                            '${diretor.biografia}',
                            '${diretor.foto}')`

        let result = await prisma.$executeRawUnsafe(sql)
        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

//Altera um diretor no banco de dados
const setUpdateDirectors = async function (diretor) {
    try {

        let sql = `update tbl_diretores set
                        nome                = '${diretor.nome}', 
                        nome_artistico      = '${diretor.nome_artistico}', 
                        data_nascimento     = '${diretor.data_nascimento}', 
                        nacionalidade       = '${diretor.nacionalidade}',
                        biografia           = '${diretor.biografia}', 
                        foto                = '${diretor.foto}'
        
                    where id_diretores = ${diretor.id}`

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

//Exclui um diretor pelo id no banco de dados
const setDeleteDirectors = async function (id) {
    try {
        let sql = `delete from tbl_diretores where id_diretores = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result))
            return result
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
        let sql = `select id_diretores from tbl_diretores order by id_diretores desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].id_diretores)
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllDirectors,
    getDirectorById,
    setInsertDirectors,
    setUpdateDirectors,
    setDeleteDirectors,
    getSelectLastId
}