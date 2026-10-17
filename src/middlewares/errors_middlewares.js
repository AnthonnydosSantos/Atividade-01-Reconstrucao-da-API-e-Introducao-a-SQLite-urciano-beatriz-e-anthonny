// Middleware "catch-all" para rotas inexistentes
export const notFound = (req, res, next) => {
  res.status(404).json({
    message: "Esta rota não existe na API",
    method: req.method,
    path: req.originalUrl,
    status: 404,
  });
};

// Middleware para erros
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  return res.status(500).json({
    message: "Erro interno do servidor",
    error: err.message,
  });
};
