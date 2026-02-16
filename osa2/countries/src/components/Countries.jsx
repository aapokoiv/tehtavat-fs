import countryService from '../services/countries.js'
import { useEffect } from 'react'
import FullInfo from './FullInfo.jsx'

const Countries = ({ countries }) => {
  if (countries.length > 10) {
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  } else if (countries.length === 1) {
    return (
      <FullInfo country={countries[0]} />
    )
  } else if (countries.length !== 0) {
    return (
      <ul>
        {countries.map(c => 
          <Country key={c} country={c} />
        )}
      </ul>
    )
  } else {
    return <p>No countries found</p>
  }
}

const Country = ({ country }) => <li>{country}</li>

export default Countries
