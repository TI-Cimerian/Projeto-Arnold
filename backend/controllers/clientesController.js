const clientesRepository = require('../repository/clientesRepository')

const getClientes = async (req, res) => {
  try {
    const clientes = await clientesRepository.getClientes()

    return res.json(clientes.rows)
  } catch (error) {
    console.log('Erro ao buscar clientes:', error)
  }
}
const createCliente = async (req, res) => {
  const {
    nomeCompleto,
    tipoCliente,
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
  } = req.body

  const payload = {
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
  }

  try {
    const clienteExistente = await clientesRepository.getClienteByEmail(email)
    if (clienteExistente.rowCount != 0) {
      return res.status(400).json({ error: 'Cliente já cadastrado' })
    }
    const cliente = await clientesRepository.createCliente(payload)

    return res
      .status(201)
      .json(cliente, { message: 'Cliente cadastrado com sucesso' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao cadastrar cliente' })
  }
}
module.exports = {
  getClientes,
  createCliente,
}
