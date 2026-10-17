PRAGMA foreign_keys = ON;

-- =========================================================
-- 1. SELECT PARA TODAS AS TABELAS
-- =========================================================
SELECT * FROM cliente;
SELECT * FROM endereco;
SELECT * FROM categoria;
SELECT * FROM produto;
SELECT * FROM pedido;
SELECT * FROM item_pedido;
SELECT * FROM pagamento;
SELECT * FROM frete;
SELECT * FROM entrega_frete;
SELECT * FROM estoque;
SELECT * FROM avaliacao;

-- =========================================================
-- 2. WHERE PARA TODAS AS TABELAS
-- =========================================================
SELECT * FROM cliente WHERE id_cliente = 1;
SELECT * FROM endereco WHERE cidade = 'Aracati';
SELECT * FROM categoria WHERE nome = 'Eletrônicos';
SELECT * FROM produto WHERE preco > 100;
SELECT * FROM pedido WHERE status_pedido = 'Enviado';
SELECT * FROM item_pedido WHERE quantidade > 1;
SELECT * FROM pagamento WHERE status_pagamento = 'Aprovado';
SELECT * FROM frete WHERE valor_base < 30;
SELECT * FROM entrega_frete WHERE status_entrega = 'Em trânsito';
SELECT * FROM estoque WHERE quantidade_atual <= quantidade_minima;
SELECT * FROM avaliacao WHERE nota >= 4;

-- =========================================================
-- 3. ORDER BY PARA TODAS AS TABELAS
-- =========================================================
SELECT * FROM cliente ORDER BY nome ASC;
SELECT * FROM endereco ORDER BY cidade ASC;
SELECT * FROM categoria ORDER BY nome ASC;
SELECT * FROM produto ORDER BY preco DESC;
SELECT * FROM pedido ORDER BY data DESC;
SELECT * FROM item_pedido ORDER BY preco_total DESC;
SELECT * FROM pagamento ORDER BY valor_pago DESC;
SELECT * FROM frete ORDER BY valor_base ASC;
SELECT * FROM entrega_frete ORDER BY prazo_entrega ASC;
SELECT * FROM estoque ORDER BY quantidade_atual ASC;
SELECT * FROM avaliacao ORDER BY nota DESC;

-- =========================================================
-- 4. JOINs ENTRE TABELAS RELACIONADAS
-- =========================================================

-- JOIN 1: pedidos com o nome do cliente
SELECT
    p.id_pedido,
    c.nome AS cliente,
    p.data,
    p.status_pedido,
    p.total
FROM pedido p
INNER JOIN cliente c ON p.id_cliente = c.id_cliente
ORDER BY p.data DESC;

-- JOIN 2: produtos com suas categorias
SELECT
    pr.id_produto,
    pr.nome AS produto,
    c.nome AS categoria,
    pr.preco
FROM produto pr
INNER JOIN categoria c ON pr.id_categoria = c.id_categoria
ORDER BY pr.preco DESC;

-- JOIN adicional: itens, produtos e pedidos
SELECT
    ip.id_item,
    ip.id_pedido,
    pr.nome AS produto,
    ip.quantidade,
    ip.preco_total
FROM item_pedido ip
INNER JOIN produto pr ON ip.id_produto = pr.id_produto
ORDER BY ip.id_pedido;

-- =========================================================
-- 5. FUNÇÕES DE AGREGAÇÃO
-- =========================================================

-- COUNT: quantidade de produtos cadastrados
SELECT COUNT(*) AS total_produtos
FROM produto;

-- SUM: valor total dos pedidos
SELECT SUM(total) AS valor_total_pedidos
FROM pedido;

-- COUNT + GROUP BY: pedidos por status
SELECT status_pedido, COUNT(*) AS quantidade
FROM pedido
GROUP BY status_pedido
ORDER BY quantidade DESC;

-- SUM + GROUP BY: faturamento por cliente
SELECT
    c.nome AS cliente,
    SUM(p.total) AS total_gasto
FROM cliente c
INNER JOIN pedido p ON c.id_cliente = p.id_cliente
GROUP BY c.id_cliente, c.nome
ORDER BY total_gasto DESC;