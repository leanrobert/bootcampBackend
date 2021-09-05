import React, { useState, useEffect } from 'react'
import { getAll, create, update, deletePerson } from './services/phonebook'
import SearchBar from './components/SearchBar'
import Form from './components/Form'
import PhoneBook from './components/PhoneBook'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newPhone, setNewPhone ] = useState('')
  const [ newName, setNewName ] = useState('')
  const [ search, setSearch ] = useState('')
  const [ message, setMessage ] = useState(null)
  const [ error, setError ] = useState(null)

  useEffect(() => {
    getAll().then(persons => setPersons(persons.data))
  }, [])

  const addPerson = (e) => {
    e.preventDefault()

    const duplicated = persons.find(one => one.name === newName)

    if(duplicated) {
      if(window.confirm(`${duplicated.name} is already added to phonebook, replace the old number with a new one?`)) {
        updatePerson(duplicated)
      }
    } else { 
      const person = {
        name: newName,
        number: newPhone
      }

      create(person)
        .then(promise => {
          setPersons(persons.concat(promise.data))
          setMessage(`Contact ${person.name} was created successfully`)
        })
        .catch(error => {
          setError(error.message)
        })
      
      setTimeout(() => setMessage(null), 5000)
    }
    setNewName('')
    setNewPhone('')
  }

  const updatePerson = (person) => {
    const newPerson = {
      name: person.name,
      number: newPhone
    }

    update(person.id, newPerson)
      .then(response => {
        setMessage(`Contact ${newPerson.name} was updated successfully`)
        setPersons(persons.map(people => person.id !== people.id ? people : response.data))
      })
      .catch(error => setError(`${person.name} was already removed from server`))
      
    setTimeout(() => setError(null), 5000)
    setTimeout(() => setMessage(null), 5000)
  }

  const deleteEntry = (person) => {
    if(window.confirm(`Delete ${person.name} ?`)) {
      deletePerson(person.id)
        .then(promise => setPersons(persons.filter(item => item.id !== person.id)))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} error={error} />
      <SearchBar search={search} setSearch={setSearch} />
      <h2>Add a new</h2>
      <Form addPerson={addPerson} newName={newName} newPhone={newPhone} setNewName={setNewName} setNewPhone={setNewPhone} />
      <h2>Numbers</h2>
      <PhoneBook persons={persons} search={search} delentry={deleteEntry}/>
    </div>
  )
}

export default App
