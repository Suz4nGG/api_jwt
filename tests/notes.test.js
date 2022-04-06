const { server } = require('../index')
const mongoose = require('mongoose')
const Note = require('../models/Schema_Note')
const { initialNotes, api, getAllContentNotes, newNote, errorNote, editNote } = require('./helperCode')

// // Antes del test
beforeEach(async () => {
  await Note.deleteMany({})
  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

test('notes are returned as JSON', async () => {
  await api.get('/api/notes').expect(200).expect('Content-Type', /application\/json/)
})

test('Existen dos notas en la API', async () => {
  const { response } = (await getAllContentNotes())
  expect(response.body).toHaveLength(initialNotes.length)
})

test('El contenido de la nota deberia ser: Hola soy una nota creada desde el test', async () => {
  const { response } = (await getAllContentNotes())
  expect(response.body[0].content).toBe('Hola soy una nota creada desde el test')
})

test('El valor deberia de ser: Susan', async () => {
  const { contents } = (await getAllContentNotes())
  expect(contents).toContain('Hola soy OTRA nota creada desde el TEST!! Hola Susan')
})

test('POST', async () => {
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  const { contents } = (await getAllContentNotes())
  expect(contents).toContain(newNote.content)
})

test('El contenido de la nota no deberia estar vacio', async () => {
  await api
    .post('/api/notes')
    .send(errorNote)
    .expect(400)
  const { response } = (await getAllContentNotes())
  expect(response.body).toHaveLength(initialNotes.length)
})

test('La nota no puede ser borrada', async () => {
  const { response: firstResponse } = (await getAllContentNotes())
  const { body: notes } = firstResponse
  const noteToDelete = notes[0]
  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const { contents, response: secondResponse } = await getAllContentNotes()
  expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
  expect(contents).not.toContain(noteToDelete.content)
})

test('ID invalido la operación de borrado fallo', async () => {
  await api
    .delete('/api/notes/123')
    .expect(404)
  const { response } = await getAllContentNotes()
  expect(response.body).toHaveLength(initialNotes.length)
})

test('No existe el ID de la nota', async () => {
  const validObjectIdThatDoNotExist = '60451827152dc22ad768f442'
  await api
    .delete(`/api/notes/${validObjectIdThatDoNotExist}`)
    .expect(204)
  const { response } = await getAllContentNotes()
  expect(response.body).toHaveLength(initialNotes.length)
})

test('La ID de la nota a editar no es valido', async () => {
  const idNoteToEdit = '60451827152dc22adc22768f442'
  await api
    .put(`/api/notes/${idNoteToEdit}`)
    .send(editNote)
    .expect(404)
  const { contents } = await getAllContentNotes()
  expect(contents).not.toContain(editNote.content)
})

test('La ID no existe', async () => {
  const idNotValid = '6219bb641f870b866dde197d'
  const { response } = await getAllContentNotes()
  const dataID = response.body.map(note => note.id)
  console.log(dataID)
  if (idNotValid === dataID) {
    await api
      .put(`/api/notes/${idNotValid}`)
      .send(editNote)
      .expect(200)
  } else {
    expect(404)
  }
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})

/*
// Ejecutar un test en especifico
*
npm run test -- -t "The first content is about Susan"
*/
