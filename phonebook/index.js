require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require('./models/phonebook')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('content', function (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/api/persons', (req, res, next) => {
  Phonebook.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Phonebook.findById(req.params.id)
    .then(person => {
      if(person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if(!name || !number) {
    return res.status(400).json({ error: 'content missing' })
  }

  const phone = new Phonebook({ name, number })
  phone.save()
    .then(savedPhone => res.json(savedPhone))
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Phonebook.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Phonebook.findByIdAndRemove(req.params.id)
    .then(res.status(204).end())
    .catch(error => next(error))
}) 

app.get('/info', (req, res) => {
  const date = new Date()
  Phonebook.find({})
    .then(persons => res.send(`<div><p>Phonebook has info for ${persons.length} people</p><p>${date}</p></div>`))
})

const errorHandling = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandling)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})