import { useAnecdoteActions, useMessageActions } from './store'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()
  const { setMessage } = useMessageActions()

  const addAnecdote = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    const newAnecdote = await anecdoteService.createNew(content)
    add(newAnecdote)
    setMessage(`Added: ${content}`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
    e.target.reset()
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
