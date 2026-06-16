import { useAnecdoteActions } from './store'

const Filter = () => {
  const { setFilter } = useAnecdoteActions()

  const handleChange = e => {
    e.preventDefault()
    const search = e.target.value
    setFilter(search)
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter
