const Header = ({ name }) => <h2>{name}</h2>

const Content = ({ parts }) => {
  console.log('Content', parts)
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}

const Part = ({ part }) => { 
  console.log('Part', part.name)
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Total = ({ parts }) => {
  const totalExercises = parts.reduce((total, part) => {
      return total + part.exercises
    }, 0)
  return (
    <p>
      <strong>Total of {totalExercises} exercises</strong>
    </p>
  )
}

const Course = ({ course }) => {
  console.log('Course', course.parts)
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course
