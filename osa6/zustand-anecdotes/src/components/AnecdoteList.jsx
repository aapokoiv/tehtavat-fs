import { useAnecdotes, useAnecdoteActions, useMessageActions } from './store'
import anecdoteService from '../services/anecdotes'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, remove } = useAnecdoteActions()
  const { setMessage } = useMessageActions()

  const handleVote = (anecdote) => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    anecdoteService.update(updatedAnecdote)
    vote(anecdote.id)
    setMessage(`You voted: ${anecdote.content}`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleDelete = (anecdote) => {
    anecdoteService.remove(anecdote.id)
    remove(anecdote.id)
    setMessage(`Removed: ${anecdote.content}`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  return (
    <>
      <ul>
        {anecdotes.map(anecdote => (
          <li key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes} votes
              <button style={{marginLeft: '8px'}} onClick={() => handleVote(anecdote)}>vote</button>
              {anecdote.votes === 0 && <button style={{marginLeft: '8px'}} onClick={() => handleDelete(anecdote)}>delete</button>}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default AnecdoteList
