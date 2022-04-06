require('dotenv').config()
require('./mongo')
const logger = require('./loggerMiddleware')
const express = require('express')
const cors = require('cors')
// ** Middlewares de errores
const handleErrors = require('./middlewares/handleErrors')
const pathError = require('./middlewares/pathError')
const notFound = require('./middlewares/NotFound')
// // Controladores
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')
const app = express()
app.use(express.json())
app.use(cors())
app.use(logger)

// * Definición de las rutas
// Ruta principal
app.get('/', (response) => response.send('<h1>Bienvenido a la API</h1>'))
// Llamada desde el controlador de notas
app.use('/api/notes', notesRouter)
// Llamada desde el controlador de usuarios
app.use('/api/users', usersRouter)
// Llamada desde el controlador de login
app.use('/api/login', loginRouter)
// Middlewares
app.use(notFound)
app.use(pathError)
app.use(handleErrors)

//* Definición del servidor
const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { server, app }
