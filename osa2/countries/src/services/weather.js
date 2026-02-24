import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
const iconUrl = 'https://openweathermap.org/payload/api/media/file'
const api_key = import.meta.env.VITE_WEATHER_API

const getWeather = (lat, lon) => {
  console.log(lat, lon)
  const request = axios.get(`${baseUrl}lat=${lat}&lon=${lon}&appid=${api_key}`)
  return request.then(response => response.data)
}

const getIcon = code => {
  const request = axios.get(`${baseUrl}/${code}@2x.png`)
  return request.then(response => response.data)
}

export default { getWeather, getIcon }
