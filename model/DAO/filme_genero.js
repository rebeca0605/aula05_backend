/****************************************************************************************
* Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente ao relacionamento entre filme e gênero.
* Data: 05/10/2025
* Autor: Rebeca Gomes
* Versão: 1.0
*****************************************************************************************/

//Import da dependência do prisma que permite a execução de script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Cria um novo objeto baseado na classe PrismaClient
const prisma = new PrismaClient()

//Retorna todos os filmes e gêneros cadastrados no banco de dados
const getSelectAllMoviesGenres = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_filme_genero order by id desc`

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
const getSelectByIdMoviesGenres = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_filme_genero where id=${id}`

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

//Retorna uma lista de gêneros filtrando pelo id do filme
const getSelectGenresByIdMovies = async function (id_filme) {
    try {
        //Script SQL
        let sql = `select tbl_genero.genero_id, tbl_genero.nome
                    from tbl_filme 
                        inner join tbl_filme_genero
                            on tbl_filme.filme_id = tbl_filme_genero.filme_id
                        inner join tbl_genero
                            on tbl_genero.genero_id = tbl_filme_genero.genero_id
                    where tbl_filme.filme_id =${id_filme}`

                    //console.log(sql)


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

//Retorna uma lista de filmes filtrando pelo id do gênero
const getSelectMoviesByIdGenre = async function (id_genero) {
    try {
        //Script SQL
        let sql = `select tbl_filme.filme_id, tbl_filme.nome
                    from tbl_filme 
                        inner join tbl_filme_genero
                            on tbl_filme.filme_id = tbl_filme_genero.filme_id
                        inner join tbl_genero
                            on tbl_genero.genero_id = tbl_filme_genero.genero_id
                    where tbl_genero.genero_id =${id_genero}`

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

//Retorna o último id gerado no banco de dados
const getSelectLastId = async function(){
    try {
        //Script sql para retornar apenas o último id do banco
        let sql = `select id from tbl_filme_genero order by id desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].id)
        else
            return false

    } catch (error) {
        return false
    }
}

//Insere um gênero novo no banco de dados
const setInsertMoviesGenres = async function (filmeGenero) {
    try {
        let sql = `INSERT INTO tbl_filme_genero (filme_id, genero_id)
                    VALUES (${filmeGenero.id_filme}, ${filmeGenero.id_genero})`

        let result = await prisma.$executeRawUnsafe(sql)

        console.log(result)
        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

//Altera um gênero no banco de dados
const setUpdateMoviesGenres = async function (filmeGenero) {
    try {

        let sql = `update tbl_filme_genero set 
                        filme_id = ${filmeGenero.id_filme}, 
                        genero_id = ${filmeGenero.id_genero} 
                    where id = ${filmeGenero.id}`

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

//Exclui um genero pelo id no banco de dados
const setDeleteMoviesGenres = async function (id) {
    try {
        let sql = `delete from tbl_filme_genero where id = ${id}`

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

module.exports = {
    getSelectAllMoviesGenres,
    getSelectByIdMoviesGenres,
    getSelectGenresByIdMovies,
    getSelectMoviesByIdGenre,
    getSelectLastId,
    setInsertMoviesGenres,
    setUpdateMoviesGenres,
    setDeleteMoviesGenres
}