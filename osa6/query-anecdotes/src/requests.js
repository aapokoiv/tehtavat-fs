const baseUrl = 'http://localhost:3003/anecdotes'

export const getAll = async () => {
  const res = await fetch(baseUrl)
  if (!res.ok) {
    throw new Error('failed fetching anecdotes')
  }
  return await res.json()
}

export const create = async (newAnecdote) => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAnecdote)
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }
  return await res.json()
}

export const update = async (updatedAnecdote) => {
  const res = await fetch(`${baseUrl}/${updatedAnecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAnecdote)
  })
  if (!res.ok) {
    throw new Error('failed updating anecdote')
  }
  return await res.json()
}
