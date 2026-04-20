const maquinasRepository = require("../repository/maquinasRepository");

const getAllMaquinas = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const { opcaoCategoria, opcaoSubCategoria } = req.query;
    const limit = parseInt(req.query.limit) || 500;
    const page = parseInt(req.query.page) || 1;
    const vendedor = req.query.vendedor;
    const offset = (page - 1) * limit;

    let whereClauses = [];
    let values = [];
    let paramIndex = 1;

    if (searchTerm) {
      const searchNumber = parseInt(searchTerm);

      if (!isNaN(searchNumber)) {
        whereClauses.push(`id = $${paramIndex}`);
        values.push(searchNumber);
        paramIndex++;
      } else {
        whereClauses.push(`nome ILIKE $${paramIndex}`);
        values.push(`%${searchTerm}%`);
        paramIndex++;
      }
    }

    if (opcaoCategoria && opcaoCategoria !== "todas") {
      whereClauses.push(`categoria = $${paramIndex}`);
      values.push(opcaoCategoria);
      paramIndex++;
    }

    if (opcaoSubCategoria && opcaoSubCategoria !== "todas") {
      whereClauses.push(`sub_categoria = $${paramIndex}`);
      values.push(opcaoSubCategoria);
      paramIndex++;
    }

    const whereSQL = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    values.push(limit, offset);

    const maquinas = await maquinasRepository.getMaquinas(
      whereSQL,
      paramIndex,
      values,
    );

    return res.json(maquinas.rows);
  } catch (error) {
    console.error("Erro ao obter máquinas:", error);
    return res.status(500).json({ error: "Erro ao obter máquinas" });
  }
};

const getMaquinaByID = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const maquina = await maquinasRepository.getMaquinaByID(id);
    if (!maquina) {
      return res.status(404).json({ error: "Máquina não encontrada" });
    }
    return res.status(200).json(maquina);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar máquina" });
  }
};
module.exports = {
  getAllMaquinas,
  getMaquinaByID,
};
