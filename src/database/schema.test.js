import assert from "node:assert/strict";
import test from "node:test";
import Database from "better-sqlite3";
import { runQueryExamples } from "./queries.js";
import { createSchema } from "./schema.js";
import { seedDatabase } from "./seed.js";

test("creates and seeds all entities from the DER", () => {
  const database = new Database(":memory:");
  database.pragma("foreign_keys = ON");

  createSchema(database);
  seedDatabase(database);
  seedDatabase(database);

  const tables = database
    .prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
    )
    .all()
    .map(({ name }) => name);

  for (const table of [
    "cliente",
    "endereco",
    "categoria",
    "produto",
    "pedido",
    "item_pedido",
    "pagamento",
    "frete",
    "entrega_frete",
    "estoque",
    "avaliacao",
    "cupom_desconto",
    "movimentacao_estoque",
  ]) {
    assert.ok(tables.includes(table), `Expected table ${table}`);
  }

  assert.equal(
    database.prepare("SELECT COUNT(*) AS total FROM cliente").get().total,
    5,
  );
  assert.equal(
    database
      .prepare("SELECT COUNT(*) AS total FROM item_pedido")
      .get().total,
    9,
  );
  assert.equal(
    database
      .prepare("SELECT total FROM pedido WHERE id_pedido = 1")
      .get().total,
    339.6,
  );
  assert.equal(
    database
      .prepare(
        "SELECT COUNT(*) AS total FROM produto WHERE imagem IS NOT NULL AND imagem != ''",
      )
      .get().total,
    6,
  );
  assert.equal(Object.keys(runQueryExamples(database)).length, 5);
  assert.deepEqual(database.pragma("foreign_key_check"), []);
  database.close();
});

test("upgrades an existing database without losing its records", () => {
  const database = new Database(":memory:");
  database.pragma("foreign_keys = ON");
  database.exec(`
    CREATE TABLE cliente (
      id_cliente INTEGER PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      telefone TEXT
    );
    CREATE TABLE categoria (
      id_categoria INTEGER PRIMARY KEY,
      nome TEXT NOT NULL,
      descricao TEXT
    );
    CREATE TABLE frete (
      id_frete INTEGER PRIMARY KEY,
      nome_transportadora TEXT NOT NULL,
      tipo_frete TEXT NOT NULL,
      valor_base REAL NOT NULL,
      prazo_estipulado INTEGER NOT NULL
    );
    CREATE TABLE produto (
      id_produto INTEGER PRIMARY KEY,
      id_categoria INTEGER NOT NULL REFERENCES categoria(id_categoria),
      nome TEXT NOT NULL,
      disponibilidade INTEGER NOT NULL,
      preco REAL NOT NULL,
      detalhes TEXT
    );
    CREATE TABLE pedido (
      id_pedido INTEGER PRIMARY KEY,
      id_cliente INTEGER NOT NULL REFERENCES cliente(id_cliente),
      data TEXT NOT NULL,
      status_pedido TEXT NOT NULL,
      total REAL NOT NULL
    );
    INSERT INTO cliente VALUES (1, 'Cliente existente', 'cliente@email.com', NULL);
    INSERT INTO categoria VALUES (1, 'Jogos', NULL);
    INSERT INTO produto VALUES (1, 1, 'Produto existente', 1, 10, NULL);
    INSERT INTO produto VALUES (2, 1, 'Mouse Gamer RGB', 1, 10, NULL);
    INSERT INTO pedido VALUES (1, 1, '2026-01-01', 'Pendente', 10);
  `);

  createSchema(database);
  seedDatabase(database);

  assert.equal(
    database.prepare("SELECT nome FROM produto WHERE id_produto = 1").get()
      .nome,
    "Produto existente",
  );
  assert.equal(
    database
      .prepare("SELECT imagem FROM produto WHERE id_produto = 2")
      .get().imagem,
    "/images/mouse-gamer.svg",
  );
  assert.ok(
    database
      .prepare("PRAGMA table_info(produto)")
      .all()
      .some(({ name }) => name === "id_frete"),
  );
  assert.ok(
    database
      .prepare("PRAGMA table_info(produto)")
      .all()
      .some(({ name }) => name === "imagem"),
  );
  assert.ok(
    database
      .prepare("PRAGMA table_info(pedido)")
      .all()
      .some(({ name }) => name === "id_cupom"),
  );
  assert.ok(
    database
      .prepare("PRAGMA foreign_key_list(produto)")
      .all()
      .some(({ from, table }) => from === "id_frete" && table === "frete"),
  );
  assert.ok(
    database
      .prepare("PRAGMA foreign_key_list(pedido)")
      .all()
      .some(
        ({ from, table }) =>
          from === "id_cupom" && table === "cupom_desconto",
      ),
  );
  assert.deepEqual(database.pragma("foreign_key_check"), []);
  database.close();
});
