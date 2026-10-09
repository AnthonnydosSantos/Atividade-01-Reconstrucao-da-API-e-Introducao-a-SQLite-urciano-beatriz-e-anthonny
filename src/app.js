import express from "express";
import dotenv from "dotenv";
import db from "./database/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "Geek Store - Backend em execução!",
    banco: "SQLite conectado",
    sucesso: true
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});