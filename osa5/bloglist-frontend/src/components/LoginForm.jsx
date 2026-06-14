import { useState } from 'react'
import loginService from '../services/login.js'
import blogService from '../services/blogs.js'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button, colors, Input } from './sharedStyles.js'

const Form = styled.form`
  background: ${colors.aliceBlue};
  border: 2px solid ${colors.charcoalBrown};
  border-radius: 1rem;
  color: ${colors.charcoalBrown};
  display: grid;
  gap: 1rem;
  margin: 2rem 0;
  max-width: 26rem;
  padding: 1.5rem;
`

const FormGroup = styled.div`
  label {
    display: grid;
    font-weight: 700;
  }
`

const LoginForm = ({ setMessage, setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const onSubmit = event => {
    event.preventDefault()
    handleLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  const handleLogin = async credentials => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setMessage({ message: 'Logged in successfully', type: 'success' })
      setTimeout(() => {
        setMessage({ message: null, type: '' })
      }, 5000)
      navigate('/')
    } catch {
      setMessage({ message: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setMessage({ message: null, type: '' })
      }, 5000)
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      <FormGroup>
        <label>
          username
          <Input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </FormGroup>
      <FormGroup>
        <label>
          password
          <Input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </FormGroup>
      <Button type="submit">login</Button>
    </Form>
  )
}

export default LoginForm
