import { useState } from 'react'

const Statistics = ({ good, neutral, bad }) => {
  const all = (good + neutral + bad)
  if (all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  return (
    <table>
      <tbody>
        <StatisticLine value={good} text='good' />
        <StatisticLine value={neutral} text='neutral' />
        <StatisticLine value={bad} text='bad' />
        <StatisticLine value={all} text='all' />
        <StatisticLine value={(good - bad)/all} text='average' />
        <StatisticLine value={`${good / all * 100} %`} text='positive' />
      </tbody>
    </table>
  )
}

const StatisticLine = ({ value, text }) => <tr><td>{text}</td><td>{value}</td></tr>

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)


  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={() => setGood(good + 1)} text='good' />
      <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button onClick={() => setBad(bad + 1)} text='bad' />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
