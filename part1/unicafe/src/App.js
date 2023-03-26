import { useState } from 'react';

const Button = ({ text, handleClick }) => {
  return <button type="button" onClick={handleClick}>{text}</button>
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
}

const Statistics = ({ good, neutral, bad }) => {
  const calcPositive = (good, total) => {
    if (total === 0) return "0 %";
    let positive = (good * 100) / total;
    return `${positive} %`;
  }

  if (good === 0 && neutral === 0 && bad === 0) return <div>No feedback has been given</div>;

  return (
    <table>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={good + neutral + bad} />
      <StatisticLine text="average" value={ (good + neutral + bad) / 3 } />
      <StatisticLine text="positive" value={calcPositive(good, good + neutral + bad)} />
    </table>
  );
}

const App = () => {
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
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

export default App;
