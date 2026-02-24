import countryService from '../services/countries.js'
import { useState } from 'react'
import FullInfo from './FullInfo.jsx'

const Countries = ({ countries }) => {
  const [expanded, setExpanded] = useState([])

  const toggleExpanded = ( country ) => {
    if (expanded.includes(country)) {
      setExpanded(expanded.filter(c => c !== country))
    } else {
      setExpanded([...expanded, country])
    }
  }

  if (countries.length > 10) {
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  } else if (countries.length === 1) {
    return (
      <FullInfo country={countries[0]} toggle={null} />
    )
  } else if (countries.length !== 0) {
    return (
      <ul>
        {countries.map(c => 
          <Country key={c} country={c} isExpanded={expanded.includes(c)} toggle={toggleExpanded}/>
        )}
      </ul>
    )
  } else {
    return <p>No countries found</p>
  }
}

const Country = ({ country, toggle, isExpanded }) => {
  if (isExpanded) {
    return <FullInfo country={country} toggle={toggle} />
  } else {
    return <li>{country} <button onClick={() => toggle(country)}>Show</button> </li>
  }
}

export default Countries
