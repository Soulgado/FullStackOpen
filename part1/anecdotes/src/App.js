import { useState } from 'react';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ];

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0));

  const getRandomNumber = (max) => {
    return Math.floor(Math.random() * max);
  }

  const getMaxPointsAnecdote = () => {
    const maxNumber = Math.max(...points);   // finds largest value in the points array
    const index =  points.findIndex(element => element === maxNumber);  // finds index of the first element with maxNumber
    return index; 
  }

  const handleClick = () => {
    const randomNumber = getRandomNumber(anecdotes.length);
    setSelected(randomNumber);
  }

  const handleVoteClick = () => {
    const pointsCopy = [...points];
    pointsCopy[selected] += 1;
    setPoints(pointsCopy);
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <div>{anecdotes[selected]}</div>
      <div>has {points[selected]} votes</div>
      <button type="button" onClick={handleVoteClick}>vote</button>
      <button type="button" onClick={handleClick}>next anecdote</button>
      <h2>Anecdote with most votes</h2>
      <div>{anecdotes[getMaxPointsAnecdote()]}</div>
      <div>has {points[getMaxPointsAnecdote()]} votes</div>
    </div>
  )
}

export default App;
