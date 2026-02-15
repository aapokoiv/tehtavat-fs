import { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons.jsx'
import PersonsForm from './components/PersonsForm.jsx'
import Filter from './components/Filter.jsx'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [search, setSearch] = useState('')
  
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const exists = persons.some(person => person.name === newName)
    if (!exists) {
      const bookObject = {
        name: newName,
        number: newNum,
        id: persons.length + 1
      }
      setPersons(persons.concat(bookObject))
      setNewName('')
      setNewNum('')
    } else {
      alert(`${newName} is already in the phonebook`)
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
      <Persons persons={filteredPersons} /> 
    </div>
  )
}

export default App
