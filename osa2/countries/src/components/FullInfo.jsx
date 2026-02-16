import { useEffect, useState } from "react"
import countryService from "../services/countries"

const FullInfo = ({ country }) => {
  const [fullCountry, setFullCountry] = useState(null)

  useEffect(() => {
    countryService
      .getOne(country)
      .then(res => {
        setFullCountry(res)
      })
  }, [country])

  if (!fullCountry) {
    return null
  }

  return (
    <div>
      <h2>{fullCountry.name.common}</h2>
      <p>Capital: {fullCountry.capital}</p>
      <p>Area: {fullCountry.area}</p>
      <p>Population: {fullCountry.population}</p>
      <h4>Languages:</h4>
      <ul>
        {Object.values(fullCountry.languages).map(lan =>
          <li key={lan}>{lan}</li>
        )}
      </ul>
      <img src={fullCountry.flags.png} alt={fullCountry.flags.alt} width="150" />
    </div>
  )
}

export default FullInfo
