// Middleware para validação de um id
const verifyParamId = (request, response, next) => {
  const id = request.params.id;

  if (isNaN(id)) {
    return response.status(400).json({
      message: "Erro! Id deve ser um número!",
    });
  }

  next();
};

export default verifyParamId;
