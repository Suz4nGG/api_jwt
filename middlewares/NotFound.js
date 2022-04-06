module.exports = (response) => {
  response.status(404).json({
    error: 'El recurso solicitado no existe'
  })
}
