const categories = [
  ["Jogos", "Jogos de tabuleiro e entretenimento"],
  ["Eletrônicos", "Produtos eletrônicos e acessórios"],
  ["Colecionáveis", "Itens para colecionadores"],
  ["Roupas", "Camisetas e acessórios geek"],
];

const freights = [
  ["Correios", "PAC", 20, 7],
  ["Correios", "SEDEX", 35, 3],
  ["Transportadora Geek", "Expresso", 45, 2],
];

const customers = [
  ["Anthonny Santos", "anthonny@email.com", "88999990001"],
  ["Beatriz Lima", "beatriz@email.com", "88999990002"],
  ["Carlos Silva", "carlos@email.com", "88999990003"],
  ["Ana Lara", "ana@email.com", "88999990004"],
  ["Levi Souza", "levi@email.com", "88999990005"],
];

const addresses = [
  [1, "Rua Principal, 100", "Aracati", "62800-000"],
  [2, "Rua das Flores, 200", "Aracati", "62800-100"],
  [3, "Av. Central, 300", "Fortaleza", "60000-000"],
  [4, "Rua do Sol, 40", "Aracati", "62800-200"],
  [5, "Rua da Praia, 55", "Caucaia", "61600-000"],
];

const products = [
  [
    1,
    "Jogo de Tabuleiro RPG",
    1,
    149.9,
    "Jogo para até 6 jogadores",
    "/images/jogo-rpg.svg",
  ],
  [
    2,
    "Mouse Gamer RGB",
    1,
    89.9,
    "Mouse USB com iluminação RGB",
    "/images/mouse-gamer.svg",
  ],
  [
    2,
    "Teclado Mecânico",
    1,
    219.9,
    "Teclado mecânico ABNT2",
    "/images/teclado-mecanico.svg",
  ],
  [
    3,
    "Action Figure Geek",
    1,
    129.9,
    "Miniatura colecionável",
    "/images/action-figure.svg",
  ],
  [
    4,
    "Camiseta Geek",
    1,
    59.9,
    "Camiseta estampada",
    "/images/camiseta-geek.svg",
  ],
  [
    2,
    "Headset Gamer",
    0,
    179.9,
    "Headset com microfone",
    "/images/headset-gamer.svg",
  ],
];

const orders = [
  [1, "2026-09-10", "Entregue"],
  [2, "2026-09-12", "Enviado"],
  [3, "2026-09-14", "Em separação"],
  [4, "2026-09-15", "Pendente"],
  [5, "2026-09-16", "Cancelado"],
];

const orderItems = [
  [1, 2, 1, 89.9],
  [1, 5, 2, 59.9],
  [1, 4, 1, 129.9],
  [2, 3, 1, 219.9],
  [3, 2, 1, 89.9],
  [3, 5, 1, 59.9],
  [3, 1, 1, 149.9],
  [4, 4, 1, 129.9],
  [5, 5, 1, 59.9],
];

const payments = [
  [1, "Pix", 1, "Aprovado"],
  [2, "Cartão de crédito", 1, "Aprovado"],
  [3, "Pix", 1, "Aprovado"],
  [4, "Boleto", 0, "Pendente"],
  [5, "Cartão de débito", 0, "Estornado"],
];

const deliveries = [
  [1, 2, "SEDEX", 35, 3, "BR123456789", "Entregue"],
  [2, 1, "PAC", 20, 7, "BR987654321", "Em trânsito"],
  [3, 3, "Expresso", 45, 2, "GK555666777", "Em preparação"],
  [4, 1, "PAC", 20, 7, "BR111222333", "Em preparação"],
  [5, 1, "PAC", 20, 7, "BR444555666", "Cancelado"],
];

const stocks = [
  [1, 15, 5, "A1"],
  [2, 30, 10, "A2"],
  [3, 8, 5, "B1"],
  [4, 20, 5, "B2"],
  [5, 50, 10, "C1"],
  [6, 0, 5, "C2"],
];

const reviews = [
  [1, 2, 5, "Ótimo produto."],
  [2, 3, 4, "Teclado muito bom."],
  [3, 5, 5, "Gostei bastante da camiseta."],
  [4, 4, 4, "Produto bem feito."],
];

const insertRows = (database, table, columns, rows) => {
  const insert = database.prepare(
    `INSERT OR IGNORE INTO ${table} (${columns.join(", ")}) VALUES (${columns
      .map(() => "?")
      .join(", ")})`,
  );

  for (const row of rows) {
    insert.run(...row);
  }
};

export const seedDatabase = (database) => {
  const setProductImage = database.prepare(`
    UPDATE produto
    SET imagem = ?
    WHERE nome = ? AND (imagem IS NULL OR imagem = '')
  `);

  for (const [, nome, , , , imagem] of products) {
    setProductImage.run(imagem, nome);
  }

  if (database.prepare("SELECT 1 FROM cliente LIMIT 1").get()) {
    return;
  }

  const insertSeedData = database.transaction(() => {
    insertRows(database, "categoria", ["nome", "descricao"], categories);
    insertRows(
      database,
      "frete",
      ["nome_transportadora", "tipo_frete", "valor_base", "prazo_estipulado"],
      freights,
    );
    insertRows(database, "cliente", ["nome", "email", "telefone"], customers);
    insertRows(
      database,
      "endereco",
      ["id_cliente", "rua", "cidade", "cep"],
      addresses,
    );
    insertRows(
      database,
      "produto",
      [
        "id_categoria",
        "nome",
        "disponibilidade",
        "preco",
        "detalhes",
        "imagem",
      ],
      products,
    );

    for (const [idCliente, data, statusPedido] of orders) {
      database
        .prepare(
          "INSERT OR IGNORE INTO pedido (id_cliente, data, status_pedido) VALUES (?, ?, ?)",
        )
        .run(idCliente, data, statusPedido);
    }

    insertRows(
      database,
      "item_pedido",
      [
        "id_pedido",
        "id_produto",
        "quantidade",
        "preco_unitario",
        "preco_total",
      ],
      orderItems.map(([idPedido, idProduto, quantidade, precoUnitario]) => [
        idPedido,
        idProduto,
        quantidade,
        precoUnitario,
        quantidade * precoUnitario,
      ]),
    );

    database.exec(`
      UPDATE pedido
      SET total = (
        SELECT COALESCE(SUM(preco_total), 0)
        FROM item_pedido
        WHERE item_pedido.id_pedido = pedido.id_pedido
      )
    `);

    insertRows(
      database,
      "pagamento",
      [
        "id_pedido",
        "forma_pagamento",
        "valor_pago",
        "pagamento_confirmado",
        "status_pagamento",
      ],
      payments.map(([idPedido, formaPagamento, confirmado, status]) => {
        const total = database
          .prepare("SELECT total FROM pedido WHERE id_pedido = ?")
          .get(idPedido).total;
        return [
          idPedido,
          formaPagamento,
          status === "Pendente" ? 0 : total,
          confirmado,
          status,
        ];
      }),
    );
    insertRows(
      database,
      "entrega_frete",
      [
        "id_pedido",
        "id_frete",
        "tipo_frete",
        "valor_frete",
        "prazo_entrega",
        "codigo_rastreio",
        "status_entrega",
      ],
      deliveries,
    );
    insertRows(
      database,
      "estoque",
      ["id_produto", "quantidade_atual", "quantidade_minima", "localizacao"],
      stocks,
    );
    insertRows(
      database,
      "avaliacao",
      ["id_cliente", "id_produto", "nota", "comentario"],
      reviews,
    );
  });

  insertSeedData();
};
