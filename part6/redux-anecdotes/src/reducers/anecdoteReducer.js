import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }

// const initialState = anecdotesAtStart.map(asObject);

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      return state.map(anecdote => 
        anecdote.id !== action.payload.id ? anecdote : action.payload);
    },
    addAnecdote(state, action) {
      state.push(action.payload);
    },
    // createNew(state, action) {
    //   const newAnecdote = action.payload;
    //   state.push(newAnecdote);
    // },
    setAnecdotes(state, action) {
      return action.payload;
    }
  }
});

export const { addAnecdote, voteAnecdote, setAnecdotes } = anecdoteSlice.actions;

export const getAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(addAnecdote(newAnecdote));
  }
}

export const changeAnecdote = (id) => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll();
    const currentAnecdote = anecdotes.find(a => a.id === id);
    const votedAnecdote = { ...currentAnecdote, votes: currentAnecdote.votes + 1 };
    await anecdoteService.changeAnecdote(votedAnecdote);
    dispatch(votedAnecdote);
  }
}
export default anecdoteSlice.reducer;