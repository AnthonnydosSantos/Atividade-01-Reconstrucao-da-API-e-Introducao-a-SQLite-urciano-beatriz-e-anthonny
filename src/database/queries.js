export const queryExamples = {
  selects: [
    "SELECT * FROM cliente",
    "SELECT * FROM endereco",
    "SELECT * FROM categoria",
    "SELECT * FROM produto",
    "SELECT * FROM pedido",
    "SELECT * FROM item_pedido",
    "SELECT * FROM pagamento",
    "SELECT * FROM frete",
    "SELECT * FROM entrega_frete",
    "SELECT * FROM estoque",
    "SELECT * FROM avaliacao",
    "SELECT * FROM cupom_desconto",
    "SELECT * FROM movimentacao_estoque",
  ],
  filters: [
    "SELECT * FROM cliente WHERE id_cliente = 1",
    "SELECT * FROM endereco WHERE cidade = 'Aracati'",
    "SELECT * FROM categoria WHERE nome = 'Eletrônicos'",
    "SELECT * FROM produto WHERE preco > 100",
    "SELECT * FROM pedido WHERE status_pedido = 'Enviado'",
    "SELECT * FROM item_pedido WHERE quantidade > 1",
    "SELECT * FROM pagamento WHERE status_pagamento = 'Aprovado'",
    "SELECT * FROM frete WHERE valor_base < 30",
    "SELECT * FROM entrega_frete WHERE status_entrega = 'Em trânsito'",
    "SELECT * FROM estoque WHERE quantidade_atual <= quantidade_minima",
    "SELECT * FROM avaliacao WHERE nota >= 4",
    "SELECT * FROM cupom_desconto WHERE validade >= date('now')",
    "SELECT * FROM movimentacao_estoque WHERE tipo_movimentacao = 'Entrada'",
  ],
  orderBy: [
    "SELECT * FROM cliente ORDER BY nome ASC",
    "SELECT * FROM endereco ORDER BY cidade ASC",
    "SELECT * FROM categoria ORDER BY nome ASC",
    "SELECT * FROM produto ORDER BY preco DESC",
    "SELECT * FROM pedido ORDER BY data DESC",
    "SELECT * FROM item_pedido ORDER BY preco_total DESC",
    "SELECT * FROM pagamento ORDER BY valor_pago DESC",
    "SELECT * FROM frete ORDER BY valor_base ASC",
    "SELECT * FROM entrega_frete ORDER BY prazo_entrega ASC",
    "SELECT * FROM estoque ORDER BY quantidade_atual ASC",
    "SELECT * FROM avaliacao ORDER BY nota DESC",
    "SELECT * FROM cupom_desconto ORDER BY validade ASC",
    "SELECT * FROM movimentacao_estoque ORDER BY data_movimentacao DESC",
  ],
  joins: [
    `SELECT pedido.id_pedido, cliente.nome AS cliente, pedido.data,
      pedido.status_pedido, pedido.total
    FROM pedido
    INNER JOIN cliente ON pedido.id_cliente = cliente.id_cliente
    ORDER BY pedido.data DESC`,
    `SELECT produto.id_produto, produto.nome AS produto,
      categoria.nome AS categoria, produto.preco
    FROM produto
    INNER JOIN categoria ON produto.id_categoria = categoria.id_categoria
    ORDER BY produto.preco DESC`,
    `SELECT item_pedido.id_item, item_pedido.id_pedido, produto.nome AS produto,
      item_pedido.quantidade, item_pedido.preco_total
    FROM item_pedido
    INNER JOIN produto ON item_pedido.id_produto = produto.id_produto
    ORDER BY item_pedido.id_pedido`,
    `SELECT pedido.id_pedido, cupom_desconto.codigo,
      cupom_desconto.percentual_de_desconto
    FROM pedido
    INNER JOIN cupom_desconto ON pedido.id_cupom = cupom_desconto.id_cupom`,
    `SELECT movimentacao_estoque.id_movimentacao, produto.nome AS produto,
      movimentacao_estoque.tipo_movimentacao, movimentacao_estoque.quantidade,
      movimentacao_estoque.data_movimentacao
    FROM movimentacao_estoque
    INNER JOIN produto ON movimentacao_estoque.id_produto = produto.id_produto`,
  ],
  aggregates: [
    "SELECT COUNT(*) AS total_produtos FROM produto",
    "SELECT SUM(total) AS valor_total_pedidos FROM pedido",
    `SELECT status_pedido, COUNT(*) AS quantidade
    FROM pedido
    GROUP BY status_pedido
    ORDER BY quantidade DESC`,
    `SELECT cliente.nome AS cliente, SUM(pedido.total) AS total_gasto
    FROM cliente
    INNER JOIN pedido ON cliente.id_cliente = pedido.id_cliente
    GROUP BY cliente.id_cliente, cliente.nome
    ORDER BY total_gasto DESC`,
  ],
};

export const runQueryExamples = (database) =>
  Object.fromEntries(
    Object.entries(queryExamples).map(([category, statements]) => [
      category,
      statements.map((statement) => database.prepare(statement).all()),
    ]),
  );
