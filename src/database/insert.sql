INSERT INTO cliente (nome, email, telefone) VALUES
('Anthonny Santos', 'anthonny@email.com', '88999990001'),
('Beatriz Lima', 'beatriz@email.com', '88999990002'),
('Carlos Silva', 'carlos@email.com', '88999990003'),
('Ana Lara', 'ana@email.com', '88999990004'),
('Levi Souza', 'levi@email.com', '88999990005');

INSERT INTO endereco (id_cliente, rua, cidade, cep) VALUES
(1, 'Rua Principal, 100', 'Aracati', '62800-000'),
(2, 'Rua das Flores, 200', 'Aracati', '62800-100'),
(3, 'Av. Central, 300', 'Fortaleza', '60000-000'),
(4, 'Rua do Sol, 40', 'Aracati', '62800-200'),
(5, 'Rua da Praia, 55', 'Caucaia', '61600-000');

INSERT INTO categoria (nome, descricao) VALUES
('Jogos', 'Jogos de tabuleiro e entretenimento'),
('Eletrônicos', 'Produtos eletrônicos e acessórios'),
('Colecionáveis', 'Itens para colecionadores'),
('Roupas', 'Camisetas e acessórios geek');

INSERT INTO produto (id_categoria, nome, disponibilidade, preco, detalhes) VALUES
(1, 'Jogo de Tabuleiro RPG', 1, 149.90, 'Jogo para até 6 jogadores'),
(2, 'Mouse Gamer RGB', 1, 89.90, 'Mouse USB com iluminação RGB'),
(2, 'Teclado Mecânico', 1, 219.90, 'Teclado mecânico ABNT2'),
(3, 'Action Figure Geek', 1, 129.90, 'Miniatura colecionável'),
(4, 'Camiseta Geek', 1, 59.90, 'Camiseta estampada'),
(2, 'Headset Gamer', 0, 179.90, 'Headset com microfone');

INSERT INTO pedido (id_cliente, data, status_pedido, total) VALUES
(1, '2026-09-10', 'Entregue', 239.80),
(2, '2026-09-12', 'Enviado', 219.90),
(3, '2026-09-14', 'Em separação', 189.80),
(4, '2026-09-15', 'Pendente', 129.90),
(5, '2026-09-16', 'Cancelado', 59.90);

INSERT INTO item_pedido (id_pedido, id_produto, quantidade, preco_unitario, preco_total) VALUES
(1, 2, 1, 89.90, 89.90),
(1, 5, 2, 59.90, 119.80),
(1, 4, 1, 129.90, 129.90),
(2, 3, 1, 219.90, 219.90),
(3, 2, 1, 89.90, 89.90),
(3, 5, 1, 59.90, 59.90),
(3, 1, 1, 149.90, 149.90),
(4, 4, 1, 129.90, 129.90),
(5, 5, 1, 59.90, 59.90);

INSERT INTO pagamento (id_pedido, forma_pagamento, valor_pago, pagamento_confirmado, status_pagamento) VALUES
(1, 'Pix', 239.80, 1, 'Aprovado'),
(2, 'Cartão de crédito', 219.90, 1, 'Aprovado'),
(3, 'Pix', 189.80, 1, 'Aprovado'),
(4, 'Boleto', 0, 0, 'Pendente'),
(5, 'Cartão de débito', 59.90, 0, 'Estornado');

INSERT INTO frete (nome_transportadora, tipo_frete, valor_base, prazo_estipulado) VALUES
('Correios', 'PAC', 20.00, 7),
('Correios', 'SEDEX', 35.00, 3),
('Transportadora Geek', 'Expresso', 45.00, 2);

INSERT INTO entrega_frete (id_pedido, id_frete, tipo_frete, valor_frete, prazo_entrega, codigo_rastreio, status_entrega) VALUES
(1, 2, 'SEDEX', 35.00, 3, 'BR123456789', 'Entregue'),
(2, 1, 'PAC', 20.00, 7, 'BR987654321', 'Em trânsito'),
(3, 3, 'Expresso', 45.00, 2, 'GK555666777', 'Em preparação'),
(4, 1, 'PAC', 20.00, 7, 'BR111222333', 'Em preparação'),
(5, 1, 'PAC', 20.00, 7, 'BR444555666', 'Cancelado');

INSERT INTO estoque (id_produto, quantidade_atual, quantidade_minima, localizacao) VALUES
(1, 15, 5, 'A1'),
(2, 30, 10, 'A2'),
(3, 8, 5, 'B1'),
(4, 20, 5, 'B2'),
(5, 50, 10, 'C1'),
(6, 0, 5, 'C2');

INSERT INTO avaliacao (id_cliente, id_produto, nota, comentario) VALUES
(1, 2, 5, 'Ótimo produto.'),
(2, 3, 4, 'Teclado muito bom.'),
(3, 5, 5, 'Gostei bastante da camiseta.'),
(4, 4, 4, 'Produto bem feito.');

UPDATE pedido SET total = (SELECT COALESCE(SUM(preco_total),0) FROM item_pedido WHERE item_pedido.id_pedido = pedido.id_pedido);