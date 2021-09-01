const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://bootcamptest:${password}@cluster0.cvdwo.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
})

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        if(person.name.indexOf(' ') >= 0) {
            console.log(`added "${person.name}" number ${person.number} to phonebook`)
        } else {
            console.log(`added ${person.name} number ${person.number} to phonebook`)
        }
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(persons => {
        console.log('phonebook:');
        persons.map(person => {
            console.log(person.name, person.number);
           
        })
        mongoose.connection.close()
    })
}
