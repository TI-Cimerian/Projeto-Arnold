const maquinasRepository = require('../repository/maquinasRepository')

const getAllMaquinas = async (req, res) => {
  const { opcaoCategoria, opcaoSubCategoria } = req.query
  try {
    const maquinas = await maquinasRepository.getMaquinas(
      opcaoCategoria,
      opcaoSubCategoria
    )

    res.json(maquinas.rows)
  } catch (error) {
    console.error('Erro ao obter máquinas:', error)
    res.status(500).json({ error: 'Erro ao obter máquinas' })
  }
}

const getMaquinaByID = async (req, res) => {
  const { id } = req.params
  try {
    if (!id) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    const maquina = await maquinasRepository.getMaquinaByID(id)
    if (!maquina) {
      return res.status(404).json({ error: 'Máquina não encontrada' })
    }
    return res.status(200).json(maquina)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar máquina' })
  }
}
module.exports = {
  getAllMaquinas,
  getMaquinaByID,
}
