const baseUrl = 'http://localhost:3003/anecdotes'

const getAll = async () => {
  const res = await fetch(baseUrl)

  if (!res.ok) {
    throw new Error('Failed to fetch anecdotes')
  }

  return await res.json()
}

const createNew = async (content) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 })
  }

  const res = await fetch(baseUrl, options)

  if (!res.ok) {
    throw new Error('Failed to create a new anecdote')
  }

  return await res.json()
}

const update = async (updatedAnecdote) => {
  const res = await fetch(`${baseUrl}/${updatedAnecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: updatedAnecdote.content, votes: updatedAnecdote.votes })
  })
}

const remove = async (id) => {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
  })
}

export default { getAll, createNew, update, remove }
