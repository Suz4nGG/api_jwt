// Endpoint notas
const notesRouter = require('express').Router()
const Note = require('../models/Schema_Note')
const User = require('../models/Schema_User')
const userExtractor = require('../middlewares/userExtractor')
// * Llamar todas las notas
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(notes)
})

// * Llamar nota con un ID especifico
notesRouter.get('/:id', (request, response, next) => {
  const { id } = request.params
  Note.findById(id)
    .then(note => {
      const returnNote = note ? response.json(note) : response.status(404).end()
      return returnNote
    })
    .catch(error => next(error))
})

// ^ Crear nuevas notas
notesRouter.post('/', userExtractor, async (request, response, next) => {
  const { content, important = false } = request.body
  const { userId } = request
  const user = await User.findById(userId)
  // ! En caso de error
  if (!content) {
    return response.status(400).json({
      error: 'Note content is missing'
    })
  }
  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})

// ! Eliminar nota con un ID especifico
notesRouter.delete('/:id', userExtractor, async (request, response) => {
  const { id } = request.params
  const noteToDelete = await Note.findByIdAndDelete(id)
  if (noteToDelete === null) return response.status(404).end()
  response.status(204).end()
})

// ? Actualizar una nota con ID especifico
notesRouter.put('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params
  const noteToUpdate = request.body
  const updateNote = {
    content: noteToUpdate.content,
    important: noteToUpdate.important || false
  }
  Note.findByIdAndUpdate(id, updateNote, { new: true })
    .then(result => response.json(result))
    .catch(error => next(error))
})

module.exports = notesRouter
