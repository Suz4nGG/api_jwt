// ^ Retorno de error cada vez que enviamos una URL no valida
module.exports = (request, response) => {
  response.status(404).json({
    error: 'La URL no es valida'
  })
}
