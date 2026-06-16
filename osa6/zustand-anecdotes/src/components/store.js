import { create } from 'zustand'
import anecdoteService from '../services/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  search: '',
  actions: {
    vote: id => set(state => ({
      anecdotes: state.anecdotes.map(a => a.id === id ? {...a, votes: a.votes + 1} : a)
    })),
    add: anecdote => set(state => ({
      anecdotes: state.anecdotes.concat(anecdote)
    })),
    setFilter: text => set(state => ({
      search: text
    })),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
    remove: id => set(state => ({
      anecdotes: state.anecdotes.filter(a => a.id !== id)
    }))
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)
  const search = useAnecdoteStore((state) => state.search)
  return sortedAnecdotes.filter(a => a.content.includes(search))
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

const useNotificationStore = create((set) => ({
  message: '',
  actions: {
    setMessage: message => set(() => ({ message }))
  },
}))

export const useMessage = () => useNotificationStore((state) => state.message)
export const useMessageActions = () => useNotificationStore((state) => state.actions)

export default useAnecdoteStore
