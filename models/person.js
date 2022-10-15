const mongoose = require('mongoose')
const config = require('../config')

const dbURL = config.mongo_url

const opts = {
  autoIndex: true,
  useNewUrlParser: true,
}

mongoose
  .connect(dbURL, opts)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('connection error: ', error.message)
  })

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    trim: true,
    unique: true,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{2,3}[-][0-9]{7,8}$/gm.test(v)
      },
      message: (props) => `${props.value} is invalid phone number!`,
    },
  },
})

PersonSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const PersonModel = mongoose.model('PersonModel', PersonSchema)

module.exports = PersonModel