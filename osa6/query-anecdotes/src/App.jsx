import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdotes } from './hooks/useAnecdotes.js'
import useNotification from './hooks/useNotification.js'

const App = () => {
  const { anecdotes, isPending, isError, voteAnecdote } = useAnecdotes()
  const { addNotification } = useNotification()

  const handleVote = (anecdote) => {
    voteAnecdote(anecdote)
    addNotification(`voted ${anecdote.content}`)
  }
  if (isPending) {
    return <div>loading...</div>
  }
  if (isError) {
    return <div>anecdote service not available due to server error</div>
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
