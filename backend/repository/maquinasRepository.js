const pool = require("../database");

const maquinasRepository = {
  async getMaquinas(whereSQL, paramIndex, values) {
    let query = `SELECT * FROM maquinas ${whereSQL} ORDER BY ordenacao LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

    return await pool.query(query, values);
  },

  async getMaquinaByID(id) {
    const query = `SELECT * FROM maquinas WHERE id = $1`;
    const values = [id];

    const maquina = await pool.query(query, values);

    return maquina.rows[0];
  },
};

module.exports = maquinasRepository;
