import { useState } from 'react'
import styled from 'styled-components'
import { Button, colors, Input } from './sharedStyles.js'

const PageSection = styled.div`
  background: ${colors.aliceBlue};
  border: 2px solid ${colors.charcoalBrown};
  border-radius: 1rem;
  color: ${colors.charcoalBrown};
  margin: 2rem 0;
  max-width: 32rem;
  padding: 1.5rem;
`

const Form = styled.form`
  display: grid;
  gap: 1rem;
`

const FormGroup = styled.div`
  label {
    display: grid;
    font-weight: 700;
  }
`

const NewBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    createBlog(newBlog)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <PageSection>
      <h2>create new</h2>
      <Form onSubmit={addBlog}>
        <FormGroup>
          <label>
            title:
            <Input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </FormGroup>
        <FormGroup>
          <label>
            author:
            <Input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </FormGroup>
        <FormGroup>
          <label>
            url:
            <Input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </FormGroup>
        <Button type="submit">create</Button>
      </Form>
    </PageSection>
  )
}

export default NewBlogForm
