import { useState } from 'react';

const Button = ({ text, handleClick }) => {
  return <button type="button" onClick={handleClick}>{text}</button>
}

const Stats = ({ text, data }) => {
  return <div>{text} {data}</div>;
}

const Statistics = ({ good, neutral, bad }) => {

  const calcPositive = (good, total) => {
    if (total === 0) return "0 %";
    let positive = (good * 100) / total;
    return `${positive} %`;
  }

  return (
    <>
      <h2>Statistics</h2>
      <Stats text="good" data={good} />
      <Stats text="neutral" data={neutral} />
      <Stats text="bad" data={bad} />
      <Stats text="all" data={good + neutral + bad} />
      <Stats text="average" data={ (good + neutral + bad) / 3 } />
      <Stats text="positive" data={calcPositive(good, good + neutral + bad)} />
    </>
    
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodButtonClick = () => setGood(good + 1);
  const handleNeutralButtonClick = () => setNeutral(neutral + 1);
  const handleBadButtonClick = () => setBad(bad + 1);

  return (
    <div>
      <h2>Give feedback</h2>
      <div>
        <Button text="bad" handleClick={handleBadButtonClick} />
        <Button text="neutral" handleClick={handleNeutralButtonClick} />
        <Button text="good" handleClick={handleGoodButtonClick} />
      </div>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;
