require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person.js')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

let persons = []

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (!person) {
      return response.status(404).end()
    }
    response.json(person)
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(res =>{
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (!person) {
      return response.status(404).end()
    }

    person.name = request.body.name
    person.number = request.body.number

    return person.save().then(updatedPerson => {
      response.json(updatedPerson)
    })
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const name = request.body.name
  const number = request.body.number

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(savedPerson =>{
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

const generateId = () => Math.ceil(Math.random() * 1000000)

app.get('/info', (request, response) => {
  const date = new Date()
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
    hour12: false,
  }).format(date).replace(/,/g,"")
  const longTimezone = new Intl.DateTimeFormat('en-US', {
    timeZoneName: "long"
  }).formatToParts(date).find(p => p.type === "timeZoneName").value
  console.log('formattedDate, longTimezone:', formattedDate, longTimezone)
  Person.find({}).then(persons => {
    response.send(`<div><p>Phonebook has info for ${persons.length} people</p><p>${formattedDate} ${longTimezone}</p><div>`)
  })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

