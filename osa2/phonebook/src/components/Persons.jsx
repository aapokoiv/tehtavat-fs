import Person from './Person.jsx'

const Persons = ({ persons }) => 
      <ul>
        {persons.map(person => 
          <Person key={person.id} name={person.name} number={person.number} />
        )}
      </ul>

export default Persons
