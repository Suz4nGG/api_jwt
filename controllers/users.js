// Endpoint usuarios
const usersRouter = require('express').Router()
const User = require('../models/Schema_User')
const bcrypt = require('bcrypt')

// ^ Recuperar todos los usuarios
usersRouter.get('/', async (resquest, response) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    date: 1
  })
  response.json(users)
})

// ^ Crear nuevo usuario
usersRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, name, password } = body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    passwordHash
  })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter
