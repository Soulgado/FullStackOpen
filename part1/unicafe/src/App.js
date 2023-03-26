import { useState } from 'react';

const Button = ({ text, handleClick }) => {
  return <button type="button" onClick={handleClick}>{text}</button>
}

const Stats = ({ text, data }) => {
  return <div>{text} {data}</div>;
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
      <h2>Statistics</h2>
      <Stats text="good" data={good} />
      <Stats text="neutral" data={neutral} />
      <Stats text="bad" data={bad} />
    </div>
  )
}

export default App;
