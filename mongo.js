// * agregamos mongose
require('dotenv').config()
const mongoose = require('mongoose')
const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

//  & Creamos la variable que contendra la conexión a mongo, evaluamos que estemos utilizando un entorno de producción para poder utilizar la base de datos de prueba, que en este caso sera la original (NO es una BUENA PRACTICA utilizar la de producción)
const connectionString = NODE_ENV === 'test'
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI
// ~ Iniciamos la conexión con mongo
mongoose.connect(connectionString)
  .then(() => console.log('La conexión con MongoDB fue exitosa'))
  .catch(err => console.log(err))

process.on('uncaughException', error => {
  console.log(error)
  mongoose.connection.disconnect()
})
// // ~ Comenzamos a definir el esquema de datos
// const noteSchema = Schema ({
//     content: String,
//     date: Date,
//     important: Boolean
// })

// // ~ Creamos una instancia de las notas para crearla en la base de datos
// // ! Nombres en SINGULAR, mongo nos crea las colecciones de manera plural
// const Note = model('Note', noteSchema)

// // ? CREAMOS UNA NUEVA NOTA
// const note = new Note ({
//     content: 'Mongo es NOSQL',
//     date: new Date(),
//     important: true
// })

// note.save()
// .then(result => {
//     console.log(result)
//     // !Importante cerrar la conexión
//     mongoose.connection.close()
// })
// .catch(err => console.log(err))
// // ? El indice esta relacionado al orden en el que se guarda
// Note.find({}).then(result => {
//     console.log(result)
//     mongoose.connection.close()
// })
