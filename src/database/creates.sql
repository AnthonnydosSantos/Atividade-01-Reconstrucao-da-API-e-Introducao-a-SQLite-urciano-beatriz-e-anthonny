
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS avaliacao;
DROP TABLE IF EXISTS entrega_frete;
DROP TABLE IF EXISTS pagamento;
DROP TABLE IF EXISTS estoque;
DROP TABLE IF EXISTS item_pedido;
DROP TABLE IF EXISTS pedido;
DROP TABLE IF EXISTS endereco;
DROP TABLE IF EXISTS produto;
DROP TABLE IF EXISTS categoria;
DROP TABLE IF EXISTS frete;
DROP TABLE IF EXISTS cliente;

CREATE TABLE cliente (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefone TEXT
);

CREATE TABLE endereco (
    id_endereco INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    rua TEXT NOT NULL,
    cidade TEXT NOT NULL,
    cep TEXT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE categoria (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT
);

CREATE TABLE produto (
    id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
    id_categoria INTEGER NOT NULL,
    nome TEXT NOT NULL,
    disponibilidade INTEGER NOT NULL DEFAULT 1 CHECK (disponibilidade IN (0,1)),
    preco REAL NOT NULL CHECK (preco >= 0),
    detalhes TEXT,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE pedido (
    id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    data TEXT NOT NULL,
    status_pedido TEXT NOT NULL DEFAULT 'Pendente'
        CHECK (status_pedido IN ('Pendente','Em separação','Enviado','Entregue','Cancelado')),
    total REAL NOT NULL DEFAULT 0 CHECK (total >= 0),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE item_pedido (
    id_item INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario REAL NOT NULL CHECK (preco_unitario >= 0),
    preco_total REAL NOT NULL CHECK (preco_total >= 0),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);

CREATE TABLE pagamento (
    id_pagamento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER NOT NULL UNIQUE,
    forma_pagamento TEXT NOT NULL,
    valor_pago REAL NOT NULL CHECK (valor_pago >= 0),
    pagamento_confirmado INTEGER NOT NULL DEFAULT 0 CHECK (pagamento_confirmado IN (0,1)),
    status_pagamento TEXT NOT NULL DEFAULT 'Pendente'
        CHECK (status_pagamento IN ('Pendente','Aprovado','Recusado','Estornado')),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);

CREATE TABLE frete (
    id_frete INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_transportadora TEXT NOT NULL,
    tipo_frete TEXT NOT NULL,
    valor_base REAL NOT NULL CHECK (valor_base >= 0),
    prazo_estipulado INTEGER NOT NULL CHECK (prazo_estipulado > 0)
);

CREATE TABLE entrega_frete (
    id_entrega INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER NOT NULL UNIQUE,
    id_frete INTEGER NOT NULL,
    tipo_frete TEXT NOT NULL,
    valor_frete REAL NOT NULL CHECK (valor_frete >= 0),
    prazo_entrega INTEGER NOT NULL CHECK (prazo_entrega > 0),
    codigo_rastreio TEXT UNIQUE,
    status_entrega TEXT NOT NULL DEFAULT 'Em preparação'
        CHECK (status_entrega IN ('Em preparação','Em trânsito','Entregue','Atrasado','Cancelado')),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_frete) REFERENCES frete(id_frete)
);

CREATE TABLE estoque (
    id_estoque INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produto INTEGER NOT NULL UNIQUE,
    quantidade_atual INTEGER NOT NULL DEFAULT 0 CHECK (quantidade_atual >= 0),
    quantidade_minima INTEGER NOT NULL DEFAULT 1 CHECK (quantidade_minima >= 0),
    localizacao TEXT,
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);

CREATE TABLE avaliacao (
    id_avaliacao INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);