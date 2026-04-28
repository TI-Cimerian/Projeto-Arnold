const pool = require("../database");

const pedidosRepository = {
  async getPedidos(whereSQL, paramIndex, countValues, values) {
    const query = `SELECT p.id, p.valor_liquido_total, p.tipo_pagamento, p.vendedor, p.status, c.id as id_cliente, c.nome FROM pedidos p 
       JOIN clientes c ON p.fk_cliente = c.id
       ${whereSQL}
       ORDER BY id ASC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM pedidos p
      JOIN clientes c ON p.fk_cliente = c.id
      ${whereSQL}`;

    const totalValorQuery = `
  SELECT COALESCE(SUM(p.valor_liquido_total), 0) AS valor_total_filtrado
  FROM pedidos p
  JOIN clientes c ON c.id = p.fk_cliente
  ${whereSQL}
`;

    const totalValorResult = await pool.query(totalValorQuery, countValues);

    const pedidos = await pool.query(query, values);

    const countPedidos = await pool.query(countQuery, countValues);
    return {
      pedidos: pedidos.rows,
      totalPedidos: countPedidos.rows[0].total,
      valorTotalFiltrado: Number(totalValorResult.rows[0].valor_total_filtrado),
    };
  },

  async createPedido(
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
    status,
  ) {
    const query = `
    INSERT INTO pedidos (fk_cliente, valor_bruto_total, valor_liquido_total, desconto, vendedor, observacao, prazo, tipo_pagamento, entrada, num_parcelas, valor_parcelas, acrescimo, status)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *`;
    const values = [
      cliente,
      valorBruto,
      valorLiquido,
      desconto,
      vendedor,
      observacao,
      prazo,
      tipo_pagamento,
      entrada,
      num_parcelas,
      valor_parcelas,
      acrescimo,
      status,
    ];

    const resultPedidos = await pool.query(query, values);
    let maquinasCriadas = [];

    for (const maquina of maquinas) {
      const query = `INSERT INTO maquinas_pedido (fk_pedido, fk_maquina, quantidade, valor_total) VALUES($1,$2,$3,$4) RETURNING *`;
      const values = [
        resultPedidos.rows[0].id,
        maquina.id,
        maquina.quantidade,
        maquina.valor * maquina.quantidade,
      ];
      const maquinaPedido = await pool.query(query, values);
      maquinasCriadas.push(maquinaPedido.rows[0]);
    }
    return {
      pedido: resultPedidos.rows[0],
      maquinas: maquinasCriadas,
    };
  },

  async getPedidoByID(id) {
    const query = `
    SELECT
      mp.id AS pedido_maquina_id,
      mp.fk_pedido,
      mp.fk_maquina,
      mp.quantidade,
      mp.valor_total,

      p.id AS pedido_id,
      p.fk_cliente,
      p.tipo_pagamento,
      p.num_parcelas,
      p.valor_bruto_total,
      p.valor_liquido_total,
      p.valor_parcelas,
      p.entrada,
      p.desconto,
      p.prazo,
      p.observacao,
      p.vendedor,
      p.acrescimo,
      p.status,

      m.id AS maquina_id,
      m.nome AS maquina_nome,
      m.categoria,
      m.sub_categoria,
      m.descricao,
      m.valor AS maquina_valor,
      m.id_ploomes,
      m.comprimento,
      m.largura,
      m.altura,
      m.peso,

      c.id AS cliente_id,
      c.nome AS cliente_nome,
      c.email,
      c.telefone,
      c.cpf,
      c.cnpj,
      c.tipo_cliente,
      c.razao_social,
      c.rua,
      c.numero,
      c.bairro,
      c.cidade,
      c.estado,
      c.pais
    FROM maquinas_pedido mp
    JOIN pedidos p ON p.id = mp.fk_pedido
    JOIN maquinas m ON m.id = mp.fk_maquina
    JOIN clientes c ON p.fk_cliente = c.id
    WHERE mp.fk_pedido = ${id}
  `;

    const pedido = await pool.query(query);
    return pedido.rows;
  },

  async updateStatusPedido(id, status) {
    const query = `
    UPDATE pedidos
    SET status = $1
    WHERE id = $2
    RETURNING *
  `;

    const values = [status, id];

    const result = await pool.query(query, values);

    return result.rows[0];
  },
};

module.exports = pedidosRepository;
