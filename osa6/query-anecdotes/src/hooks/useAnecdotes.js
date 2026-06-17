import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, create, update } from '../requests.js'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    retry: 1
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: create,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: update,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    createProcess: newAnecdoteMutation,
    addAnecdote: (content, options) => newAnecdoteMutation.mutate({ content, votes: 0 },),
    voteAnecdote: (anecdote) => updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }
}
