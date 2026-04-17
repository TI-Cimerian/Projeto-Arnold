const pool = require('../database')

const clientesRepository = {
  async getClientes() {
    const query = 'SELECT * FROM clientes'

    return pool.query(query)
  },

  async getClienteByEmail(email) {
    const query = `SELECT * FROM clientes WHERE email = $1`
    const values = [email]

    return await pool.query(query, values)
  },

  async createCliente(payload) {
    const {
      tipoCliente,
      nomeCompleto,
      razaoSocial,
      cpf,
      cnpj,
      telefone,
      email,
      rua,
      bairro,
      numero,
      cidade,
      estado,
      pais,
    } = payload
    const createClienteQuery = `
     INSERT INTO clientes (
        tipo_cliente,
        nome,
        razao_social,
        cpf,
        cnpj,
        telefone,
        email,
        rua,
        bairro,
        numero,
        cidade,
        estado,
        pais
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       `

    const values = [
      tipoCliente,
      nomeCompleto,
      razaoSocial,
      cpf,
      cnpj,
      telefone,
      email,
      rua,
      bairro,
      numero,
      cidade,
      estado,
      pais,
    ]

    return await pool.query(createClienteQuery, values)
  },
}

module.exports = clientesRepository
