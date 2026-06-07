import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const req = axios.get(baseUrl)
  return req.then(res => res.data)
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }
  const req = await axios.post(baseUrl, newBlog, config)
  return req.data
}

export default { getAll, create, setToken }
