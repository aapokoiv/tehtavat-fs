const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  const name = request.body.name
  const number = request.body.number

  if (!name) {
    return response.status(400).json({
      error: 'name cannot be empty'
    })
  } else if (!number) {
    return response.status(400).json({
      error: 'number cannot be empty'
    })
  } else if (persons.some(p => p.name === name)) {
    return response.status(400).json({
      error: `${name} is already in the Phonebook`
    })
  }
  const person = {
    id: generateId(),
    name: name,
    number: number,
  }

  persons = persons.concat(person)
  response.json(person)
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

  const personCount = persons.length
  response.send(`<p>Phonebook has info for ${personCount} people</p><p>${formattedDate} ${longTimezone}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
