import { useState, useEffect } from 'react'
import personService from './services/persons.js'
import Persons from './components/Persons.jsx'
import PersonsForm from './components/PersonsForm.jsx'
import Filter from './components/Filter.jsx'
import Notification from './components/Notification.jsx'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState({text: null, isGood: true})
  
  useEffect(() => {
    personService
      .getAll()
      .then(allPersons => setPersons(allPersons))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(person => person.name === newName)
    console.log(person)
    const bookObject = {
      name: newName,
      number: newNum,
    }
    if (person === undefined) {
      personService
        .add(bookObject)
        .then(newPerson => setPersons(persons.concat(newPerson)))
      setMessage({text: `Added ${bookObject.name}`, isGood: true})
      setTimeout(() => setMessage({text: null, isGood: true}), 5000)
    } else if (window.confirm(`${person.name} is already in the phonebook, update the number?`)) {
      personService
        .update(person.id, bookObject)
        .then(updatedPerson => setPersons(persons.map(p => p.id === person.id ? updatedPerson : p)))
        .catch(error => {
          setMessage({text: `${bookObject.name} has been removed from the server`, isGood: false})
          setTimeout(() => setMessage({text: null, isGood: true}), 5000)
        })
      setMessage({text: `Updated number for ${bookObject.name}`, isGood: true})
      setTimeout(() => setMessage({text: null, isGood: true}), 5000)
    }
    setNewName('')
    setNewNum('')
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .remove(id)
        .then(removedPerson => setPersons(persons.filter(p => p.id !== id)))
      }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumChange = (event) => {
    setNewNum(event.target.value)
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message.text} isGood={message.isGood} />
      <Filter search={search} setSearch={setSearch} />
      <h2>Add new person</h2>
      <PersonsForm
        newName={newName} 
        newNum={newNum}
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumChange={handleNumChange}
        />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deletePerson={deletePerson} /> 
    </div>
  )
}

export default App
