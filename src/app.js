import express from "express";
import dotenv from "dotenv";

// Carrega as configurações do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Permite receber dados em formato JSON
app.use(express.json());

// Rota inicial para verificar se o servidor funciona
app.get("/", (req, res) => {
  res.json({
    mensagem: "Geek Store - Backend em execução!",
    sucesso: true
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});