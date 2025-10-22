/****************************************************************************************
* Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente ao gênero.
* Data: 22/10/2025
* Autor: Rebeca Gomes
* Versão: 1.0
*****************************************************************************************/

//Import da dependência do prisma que permite a execução de script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Cria um novo objeto baseado na classe PrismaClient
const prisma = new PrismaClient()

//Retorna todos os gêneros cadastrados no banco de dados
const getAllGenders = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_genero order by id_genero desc`

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

//Retorna um gênero filtrando pelo id do banco de dados
const getSelectGendersById = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_genero where id_genero=${id}`

        //Encaminha para o banco de dados o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        elses
            return false
    } catch (error) {
        //console.log(error)
        return false
    }
}

//Insere um gênero novo no banco de dados
const setInsertGenders = async function (genero) {
    try {
        let sql = `INSERT INTO tbl_genero (nome) VALUES ('${genero.nome}')`

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

//Altera um gênero no banco de dados
const setUpdateGenders = async function (genero) {
    try {

        let sql = `update tbl_genero set nome = '${genero.nome}' where id_genero = ${genero.id}`

        //console.log(sql)
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
        let sql = `select id_genero from tbl_genero order by id_genero desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].id_genero)
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    getAllGenders,
    getSelectGendersById,
    setInsertGenders,
    setUpdateGenders,
    getSelectLastId
}