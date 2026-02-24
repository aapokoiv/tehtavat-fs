import { useEffect, useState } from 'react'
import countryService from '../services/countries'
import weatherService from '../services/weather'

const FullInfo = ({ country, toggle }) => {
  const [fullCountry, setFullCountry] = useState(null)
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    countryService
      .getOne(country)
      .then(res => {
        setFullCountry(res)
      })
  }, [country])

  useEffect(() => {
    if (fullCountry) {
      console.log(fullCountry, fullCountry.capitalInfo)
      const lat = fullCountry.capitalInfo.latlng[0]
      const lon = fullCountry.capitalInfo.latlng[1]
      weatherService
      .getWeather(lat, lon)
      .then(res => {
          setWeatherData(res)
        })}
  }, [fullCountry])

  if (!weatherData) {
    return <div>Loading data</div>
  }
  console.log(weatherData.weather[0].icon)

  return (
    <div>
      <h2>
        {fullCountry.name.common} {toggle && (
        <button onClick={() => toggle(country)}>Hide</button>
        )}
      </h2>
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
      <h4>Weather in {fullCountry.capital}</h4>
      <p>Temperature {(weatherData.main.temp-272.15).toFixed(2)} Celsius</p>
      <img src={`https://openweathermap.org/payload/api/media/file/${weatherData.weather[0].icon}.png`} alt=""/>
      <p style={{ marginTop: '0px' }}>{weatherData.weather[0].description}</p>
      <p>Wind {(weatherData.wind.speed).toFixed(1)}m/s</p>
    </div>
  )
}

export default FullInfo
