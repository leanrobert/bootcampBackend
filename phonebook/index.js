const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const PORT = 3001

app.get('/api/persons', (req, res) => {
    res.send(data);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = data.find(note => note.id === id)

    if(note) {
        res.send(note)
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body

    if(!name || !number || data.find(person => person.name === name)) {
        res.status(400).json({ error: "name must be unique" })
    } else {
        const id = Math.floor(Math.random() * 10000000)
        const phone = {
            name,
            number,
            id
        }

        data = data.concat(phone)
        res.json(phone)
    }

    
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    data = data.filter(number => number.id !== id)

    res.status(204).end()
}) 

app.get('/info', (req, res) => {
    const size = data.length
    const date = new Date()
    res.send(`<div><p>Phonebook has info for ${size} people</p><p>${date}</p></div>`)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})