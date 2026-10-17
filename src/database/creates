
import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

// Descobre o caminho da pasta atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cria a pasta do banco, caso ela não exista
const pastaBanco = path.join(__dirname, "dados");
fs.mkdirSync(pastaBanco, { recursive: true });

// Cria ou abre o arquivo geek_store.db
const db = new Database(
  path.join(pastaBanco, "geek_store.db")
);

// Habilita as chaves estrangeiras
db.pragma("foreign_keys = ON");

// Cria as tabelas na ordem correta
db.exec(`

  CREATE TABLE IF NOT EXISTS cliente (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefone TEXT
  );

  CREATE TABLE IF NOT EXISTS endereco (
    id_endereco INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    rua TEXT NOT NULL,
    cidade TEXT NOT NULL,
    cep TEXT NOT NULL,

    FOREIGN KEY (id_cliente)
      REFERENCES cliente(id_cliente)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT
  );

  CREATE TABLE IF NOT EXISTS frete (
    id_frete INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_transportadora TEXT NOT NULL,
    tipo_frete TEXT NOT NULL,
    valor_base REAL NOT NULL CHECK (valor_base >= 0),
    prazo_estimado INTEGER NOT NULL CHECK (prazo_estimado >= 0)
  );

  CREATE TABLE IF NOT EXISTS produto (
    id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
    id_categoria INTEGER NOT NULL,
    nome TEXT NOT NULL,
    disponibilidade INTEGER NOT NULL DEFAULT 1
      CHECK (disponibilidade IN (0, 1)),
    preco REAL NOT NULL CHECK (preco >= 0),
    detalhes TEXT,
    id_frete INTEGER,

    FOREIGN KEY (id_categoria)
      REFERENCES categoria(id_categoria),

    FOREIGN KEY (id_frete)
      REFERENCES frete(id_frete)
      ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS pedido (
    id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    data TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status_pedido TEXT NOT NULL DEFAULT 'Pendente'
      CHECK (
        status_pedido IN (
          'Pendente',
          'Confirmado',
          'Enviado',
          'Entregue',
          'Cancelado'
        )
      ),
    total REAL NOT NULL DEFAULT 0 CHECK (total >= 0),

    FOREIGN KEY (id_cliente)
      REFERENCES cliente(id_cliente)
  );

  CREATE TABLE IF NOT EXISTS item_pedido (
    id_item INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario REAL NOT NULL CHECK (preco_unitario >= 0),
    preco_total REAL NOT NULL CHECK (preco_total >= 0),

    FOREIGN KEY (id_pedido)
      REFERENCES pedido(id_pedido)
      ON DELETE CASCADE,

    FOREIGN KEY (id_produto)
      REFERENCES produto(id_produto),

    UNIQUE (id_pedido, id_produto)
  );

  CREATE TABLE IF NOT EXISTS pagamento (
    id_pagamento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER NOT NULL UNIQUE,
    forma_pagamento TEXT NOT NULL,
    valor_pago REAL NOT NULL CHECK (valor_pago >= 0),
    pagamento_confirmado INTEGER NOT NULL DEFAULT 0
      CHECK (pagamento_confirmado IN (0, 1)),
    status_pagamento TEXT NOT NULL DEFAULT 'Pendente'
      CHECK (
        status_pagamento IN (
          'Pendente',
          'Aprovado',
          'Recusado',
          'Estornado'
        )
      ),

    FOREIGN KEY (id_pedido)
      REFERENCES pedido(id_pedido)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS entrega_frete (
    id_entrega INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER NOT NULL UNIQUE,
    id_frete INTEGER NOT NULL,
    tipo_frete TEXT NOT NULL,
    valor_frete REAL NOT NULL CHECK (valor_frete >= 0),
    prazo_entrega INTEGER NOT NULL CHECK (prazo_entrega >= 0),
    codigo_rastreio TEXT UNIQUE,
    status_entrega TEXT NOT NULL DEFAULT 'Preparando'
      CHECK (
        status_entrega IN (
          'Preparando',
          'Enviado',
          'Em trânsito',
          'Entregue',
          'Devolvido'
        )
      ),

    FOREIGN KEY (id_pedido)
      REFERENCES pedido(id_pedido)
      ON DELETE CASCADE,

    FOREIGN KEY (id_frete)
      REFERENCES frete(id_frete)
  );

  CREATE TABLE IF NOT EXISTS estoque (
    id_estoque INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produto INTEGER NOT NULL UNIQUE,
    quantidade_atual INTEGER NOT NULL DEFAULT 0
      CHECK (quantidade_atual >= 0),
    quantidade_minima INTEGER NOT NULL DEFAULT 0
      CHECK (quantidade_minima >= 0),
    localizacao TEXT,

    FOREIGN KEY (id_produto)
      REFERENCES produto(id_produto)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS avaliacao (
    id_avaliacao INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,

    FOREIGN KEY (id_cliente)
      REFERENCES cliente(id_cliente)
      ON DELETE CASCADE,

    FOREIGN KEY (id_produto)
      REFERENCES produto(id_produto)
      ON DELETE CASCADE,

    UNIQUE (id_cliente, id_produto)
  );

`);

// Confirma que o banco foi criado
console.log("Banco de dados Geek Store preparado!");

export default db;