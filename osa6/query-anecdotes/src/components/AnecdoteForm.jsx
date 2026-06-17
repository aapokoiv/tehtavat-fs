import { useAnecdotes } from '../hooks/useAnecdotes.js'
import useNotification from '../hooks/useNotification.js'

const AnecdoteForm = () => {
  const { addAnecdote } = useAnecdotes()
  const { addNotification } = useNotification()

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    addAnecdote(content, {
      onSuccess: () => {
        addNotification(`anecdote ${content} added`)
        event.target.reset()
      },
      onError: (error) => {
        addNotification(error.message)
      }
    })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
