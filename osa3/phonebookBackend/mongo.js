const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length === 4) {
  console.log('give password as argument, and optionally both a name and a number')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://admin:${password}@cluster0.gnqyek2.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personschema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personschema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
    console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to the phonebook`)
  mongoose.connection.close()
  })
}
