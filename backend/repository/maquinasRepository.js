const pool = require('../database')

const maquinasRepository = {
  async getMaquinas(opcaoCategoria, opcaoSubCategoria) {
    let query = 'SELECT * FROM maquinas WHERE 1=1 ORDER BY Ordenacao'
    const values = []

    if (opcaoCategoria !== 'todas') {
      values.push(opcaoCategoria)
      query += ` AND categoria = $${values.length}`
    }

    if (opcaoSubCategoria !== 'todas') {
      values.push(opcaoSubCategoria)
      query += ` AND sub_categoria = $${values.length}`
    }

    return await pool.query(query, values)
  },

  async getMaquinaByID(id) {
    const query = `SELECT * FROM maquinas WHERE id = $1`
    const values = [id]

    const maquina = await pool.query(query, values)

    return maquina.rows[0]
  },
}

module.exports = maquinasRepository
