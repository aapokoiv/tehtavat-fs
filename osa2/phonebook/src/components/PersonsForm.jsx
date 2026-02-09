const PersonsForm = ({ 
newName, 
newNum, 
addPerson, 
handleNameChange, 
handleNumChange 
}) => 
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange}/>
    </div>
    <div>
      number: <input value={newNum} onChange={handleNumChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

export default PersonsForm
