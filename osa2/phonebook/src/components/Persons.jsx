import Person from './Person.jsx'

const Persons = ({ persons, deletePerson }) => 
      <ul>
        {persons.map(person => 
          <Person 
            key={person.id} 
            name={person.name} 
            number={person.number} 
            deletePerson={() => deletePerson(person.id)}
          />
        )}
      </ul>

export default Persons
