import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act, render, screen, within, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AnecdoteList from '../components/AnecdoteList.jsx'

vi.mock('../services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

import anecdoteService from '../services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from '../components/store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], search: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('initialize loads anecdotes from backend', async () => {
    const mockAnecdotes = [{ id: 1, content: 'if yes then no', votes: 0 }]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdoteResult } = renderHook(() => useAnecdotes())
    expect(anecdoteResult.current).toEqual(mockAnecdotes)
  })
})

describe('useAnecdotes', () => {
  const anecdotes = [
        { id: 1, content: 'if yes then no', votes: 9 },
        { id: 2, content: 'end2end', votes: 1 },
        { id: 3, content: 'vitesting', votes: 0 },
        { id: 4, content: 'testing', votes: 2 }
      ]
  beforeEach(async () => {
    useAnecdoteStore.setState({
      anecdotes: anecdotes,
      search: ''
    })
  })

  it('anecdoteList receives correctly sorted anecdotes', () => {
    render(<AnecdoteList />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(4)
    expect(items[0].textContent).toContain('if yes then no')
    expect(items[1].textContent).toContain('testing')
    expect(items[2].textContent).toContain('end2end')
    expect(items[3].textContent).toContain('vitesting')
  })

  it('anecdoteList receives properly filtered list of anecdotes', async () => {
    useAnecdoteStore.setState({
      anecdotes: anecdotes,
      search: 'testing'
    })
    render(<AnecdoteList />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)

    expect(items[0].textContent).toContain('testing')
    expect(items[1].textContent).toContain('vitesting')
  })

  it('Voting increases the number of votes for an anecdote', async () => {
    render(<AnecdoteList />)

    const items = screen.getAllByRole('listitem')
    const voteButton = within(items[0]).getByRole('button', { name: 'vote' })
    const user = userEvent.setup()
    await user.click(voteButton)

    within(items[0]).getByText('has 10 votes')
  })
})

afterEach(() => {
  cleanup()
})
