const config = require('./config')
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const PersonModel = require('./models/person')

const app = express()

app.use(express.json())

logger.token('reqBody', (req) => {
  return JSON.stringify(req.body)
})

app.use(
  logger(function (tokens, req, res) {
    if (req.method === 'POST') {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.req(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
        tokens['reqBody'](req, res, JSON.stringify(req.body)),
      ].join(' ')
    }
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.req(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' ')
  })
)

app.use(cors())

app.use(express.static('build'))

app.get('/api/persons', (req, res, next) => {
  PersonModel.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  PersonModel.findByIdAndDelete(id)
    .then((person) => {
      if (!person) {
        next()
      } else {
        return res.status(200).json({ message: `${id} deleted` })
      }
    })
    .catch((err) => {
      console.log(err.message)
      next(err)
    })
})

//let error;

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  const person = new PersonModel({
    name: name,
    number: number,
  })

  person
    .save()
    .then((newPerson) => {
      console.log(newPerson)
      res.status(201).json({ new_person: newPerson })
    })
    .catch((err) => {
      next(err)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const name = req.body.name
  const number = req.body.number

  const update = {
    _id: id,
    name: name,
    number: number,
  }

  const opts = { new: true, runValidators: true, context: 'query' }

  PersonModel.findOneAndUpdate({ name: name }, update, opts)
    .then((updateEntry) => {
      if (!updateEntry) next()
      res.status(200).json({ update_person: updateEntry })
    })
    .catch((error) => next(error))
})

app.get('/info', (req, res, next) => {
  PersonModel.countDocuments()
    .then((count) => {
      res
        .status(200)
        .send(`<p>Phonebook has info for ${count} people</p>${new Date()}`)
    })
    .catch((err) => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  PersonModel.findOne({ _id: id })
    .then((person) => {
      if (person) {
        const obj = `
        {
          <br />
          \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0name:\u00A0\u00A0<span style="color: green;">"${person['name']}"</span>, <br />
          \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0number:\u00A0\u00A0<span style="color: green;">"${person['number']}"</span>, <br />
          \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0id:\u00A0\u00A0<span style="color: green;">"${person['id']}"</span> <br />
        }
        
        `
        res.status(200).send(obj)
      } else {
        next()
      }
    })
    .catch((error) => {
      console.log(error)
      next(error)
    })
})

const notFoundEndpoint = (req, res) => {
  res.status(404).send({ error: 'endpoint not found' })
}

app.use(notFoundEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(404).json({ error: error.message })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError') {
    return res.status(500).json({
      error: `Duplicate name error: ${req.body.name} was already saved!`,
    })
  }

  next(error)
}

app.use(errorHandler)

const port = config.port
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})