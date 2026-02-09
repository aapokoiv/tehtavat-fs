const Filter = ({ search, setSearch }) => (
  <div>
    search: 
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
)

export default Filter
