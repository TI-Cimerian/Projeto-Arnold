const pedidosRepository = require("../repository/pedidosRepository");

const getAllPedidos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const vendedor = req.query.vendedor;
    const limit = parseInt(req.query.limit) || 500;
    const searchTerm = req.query.searchTerm || "";
    const offset = (page - 1) * limit;

    let whereClauses = [];

    let values = [];
    let paramIndex = 1;

    if (searchTerm) {
      const searchNumber = parseInt(searchTerm);

      if (!isNaN(searchNumber)) {
        whereClauses.push(`p.id = $${paramIndex}`);
        values.push(searchNumber);
        paramIndex++;
      } else {
        whereClauses.push(`c.nome ILIKE $${paramIndex}`);
        values.push(`%${searchTerm}%`);
        paramIndex++;
      }
    }

    if (vendedor) {
      whereClauses.push(`p.vendedor = $${paramIndex}`);
      values.push(vendedor);
      paramIndex++;
    }

    const whereSQL = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    values.push(limit, offset);

    const countValues = values.slice(0, values.length - 2);

    const pedidos = await pedidosRepository.getPedidos(
      whereSQL,
      paramIndex,
      countValues,
      values,
    );

    res.json(pedidos);
  } catch (error) {
    console.error("Erro ao obter pedidos:", error);
    res.status(500).json({ error: "Erro ao obter pedidos" });
  }
};

const getPedidoByID = async (req, res) => {
  const { id } = req.params;

  const pedido = await pedidosRepository.getPedidoByID(id);

  if (!pedido) {
    res.status(400).json({ error: "Pedido não encontrado" });
  }

  const primeiro = pedido[0];
  const returnPedido = {
    pedido: {
      id: primeiro.fk_pedido,
      valor_bruto: primeiro.valor_bruto_total,
      valor_liquido: primeiro.valor_liquido_total,
      desconto: primeiro.desconto,
      entrada: primeiro.entrada,
      vendedor: primeiro.vendedor,
      prazo: primeiro.prazo,
      observacao: primeiro.observacao,
      num_parcelas: primeiro.num_parcelas,
      valor_parcelas: primeiro.valor_parcelas,
      tipo_pagamento: primeiro.tipo_pagamento,
      acrescimo: primeiro.acrescimo,
    },
    cliente: {
      id: primeiro.fk_cliente,
      tipo: primeiro.tipo_cliente,
      nome: primeiro.cliente_nome,
      razao_social: primeiro.razao_social,
      cpf: primeiro.cpf,
      cnpj: primeiro.cnpj,
      telefone: primeiro.telefone,
      email: primeiro.email,
      rua: primeiro.rua,
      bairro: primeiro.bairro,
      numero: primeiro.numero,
      cidade: primeiro.cidade,
      estado: primeiro.estado,
      pais: primeiro.pais,
    },
    maquinas: pedido.map((item) => ({
      id: item.fk_maquina,
      nome: item.maquina_nome,
      categoria: item.categoria,
      sub_categoria: item.sub_categoria,
      valor_unitario: item.maquina_valor,
      quantidade: item.quantidade,
      valor_total: item.valor_total,
      referencia_ploomes: item.id_ploomes,
      comprimento: item.comprimento,
      largura: item.largura,
      altura: item.altura,
      peso: item.peso,
    })),
  };

  return res.status(200).json(returnPedido);
};
const createPedido = async (req, res) => {
  const {
    cliente,
    valorBruto,
    valorLiquido,
    desconto,
    vendedor,
    maquinas,
    observacao,
    prazo,
    tipo_pagamento,
    entrada,
    num_parcelas,
    valor_parcelas,
    acrescimo,
  } = req.body;
  if (!cliente) {
    return res.status(404).json({ error: "Cliente não selecionado" });
  }
  if (!vendedor) {
    return res.status(404).json({ error: "Vendedor não selecionado" });
  }
  if (tipo_pagamento === "Parcelamento" && entrada < 30) {
    return res
      .status(404)
      .json({ error: "A entrada deve ser de pelo menos 30%" });
  }

  try {
    const resultado = await pedidosRepository.createPedido(
      cliente,
      valorBruto,
      valorLiquido,
      desconto,
      vendedor,
      maquinas,
      observacao,
      prazo,
      tipo_pagamento,
      entrada,
      num_parcelas,
      valor_parcelas,
      acrescimo,
    );
    return res
      .status(201)
      .json(resultado, { message: "Pedido registrado com sucesso" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Erro ao processar pedido e máquinas" });
  }
};

module.exports = {
  getAllPedidos,
  createPedido,
  getPedidoByID,
};
