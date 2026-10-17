import { Router } from "express";
import database from "../database/database.js";

const router = Router();

// Consulta principal de produtos, categorias e estoque
const productQuery = `
  SELECT
    produto.id_produto AS id,
    produto.nome,
    produto.detalhes AS descricao,
    produto.preco,
    COALESCE(estoque.quantidade_atual, 0) AS estoque,
    categoria.id_categoria,
    categoria.nome AS categoria_nome
  FROM produto
  LEFT JOIN categoria
    ON categoria.id_categoria = produto.id_categoria
  LEFT JOIN estoque
    ON estoque.id_produto = produto.id_produto
`;

const getProducts = database.prepare(`
  ${productQuery}
  ORDER BY produto.nome
`);

const getProductById = database.prepare(`
  ${productQuery}
  WHERE produto.id_produto = ?
`);

const getCategories = database.prepare(`
  SELECT
    id_categoria AS id,
    nome,
    descricao
  FROM categoria
  ORDER BY nome
`);

// Página inicial
router.get("/", (req, res) => {
  res.render("index", {
    produtos: getProducts.all().slice(0, 4),
  });
});

// Listagem e busca de produtos
router.get("/produtos", (req, res) => {
  const busca =
    typeof req.query.busca === "string" ? req.query.busca.trim() : "";

  const categoriaId = Number.parseInt(req.query.categoria_id, 10) || 0;

  const products = database
    .prepare(
      `
    ${productQuery}
    WHERE (
      ? = ''
      OR produto.nome LIKE ?
      OR COALESCE(produto.detalhes, '') LIKE ?
    )
    AND (? = 0 OR produto.id_categoria = ?)
    ORDER BY produto.nome
  `,
    )
    .all(busca, `%${busca}%`, `%${busca}%`, categoriaId, categoriaId);

  res.render("produtos", {
    produtos: products,
    busca,
    categorias: getCategories.all(),
    categoriaSelecionada: categoriaId,
  });
});

// Detalhes de um produto
router.get("/produtos/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  const produto = Number.isInteger(id) ? getProductById.get(id) : null;

  if (!produto) {
    return res.status(404).send("Produto não encontrado.");
  }

  return res.render("produto-detalhe", {
    produto,
  });
});

// Adicionar produto ao carrinho
router.post("/carrinho/adicionar", (req, res, next) => {
  const produtoId = Number(req.body.produto_id);
  const quantidade = Number(req.body.quantidade);

  if (
    !Number.isSafeInteger(produtoId) ||
    produtoId < 1 ||
    !Number.isSafeInteger(quantidade) ||
    quantidade < 1
  ) {
    return res.status(400).send("Produto ou quantidade inválidos.");
  }

  const produto = getProductById.get(produtoId);

  if (!produto) {
    return res.status(404).send("Produto não encontrado.");
  }

  const carrinho = req.session.cart ?? {};
  const quantidadeAtual = Number(carrinho[produtoId] ?? 0);
  const novaQuantidade = quantidadeAtual + quantidade;

  if (novaQuantidade > produto.estoque) {
    return res.status(409).send("Quantidade solicitada maior que o estoque.");
  }

  req.session.cart = {
    ...carrinho,
    [produtoId]: novaQuantidade,
  };

  req.session.save((erro) => {
    if (erro) {
      return next(erro);
    }

    return res.redirect(303, "/carrinho");
  });
});

// Listagem de categorias
router.get("/categorias", (req, res) => {
  res.render("categorias", {
    categorias: getCategories.all(),
  });
});

// Página de login
router.get("/login", (req, res) => {
  res.render("login", {
    erro: null,
  });
});

// Página de cadastro
router.get("/cadastro", (req, res) => {
  res.render("cadastro", {
    erro: null,
  });
});

// Visualizar carrinho
router.get("/carrinho", (req, res) => {
  const itens = Object.entries(req.session.cart ?? {})
    .map(([produtoId, quantidade]) => {
      const produto = getProductById.get(Number(produtoId));

      return produto
        ? {
            ...produto,
            quantidade: Number(quantidade),
          }
        : null;
    })
    .filter(Boolean);

  const total = itens.reduce(
    (soma, item) => soma + Number(item.preco) * item.quantidade,
    0,
  );

  res.render("carrinho", {
    itens,
    total,
  });
});

export { router };
