const { app } = require('../index')
const supertest = require('supertest')

const api = supertest(app)

const errorNote = {
  important: true
}

const newNote = {
  content: 'Nota de prueba',
  important: true
}

const editNote = {
  content: 'Editar Nota',
  important: true
}

const initialNotes = [
  {
    content: 'Hola soy una nota creada desde el test',
    important: true
  },
  {
    content: 'Hola soy OTRA nota creada desde el TEST!! Hola Susan',
    important: false
  }
]

const getAllContentNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content), response
  }
}

module.exports = {
  api,
  initialNotes,
  getAllContentNotes,
  newNote,
  errorNote,
  editNote
}
