import { useState, useEffect } from 'react'
import countryService from './services/countries.js'
import Countries from './components/Countries.jsx'

const App = () => {
  const [search, setSearch] = useState('')
  const [countryNames, setCountryNames] = useState([])

  useEffect(() => {
    countryService.getAll()
    .then(res => setCountryNames(res.map(country => country.name.common)))
  }, [])

  const countriesToShow = countryNames.filter(c => c.toLowerCase().includes(search.toLowerCase()))

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  return (
    <div>
      <div>
        <input value={search} onChange={handleSearch} />
      </div>
      <div>
        <Countries countries={countriesToShow} />
      </div>
    </div>
  )

}

export default App
