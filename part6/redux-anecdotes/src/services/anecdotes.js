import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getId = () => (100000 * Math.random()).toFixed(0);

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
}

const createNew = async (content) => {
  const newAnecdote = {
    id: getId(),
    content,
    votes: 0
  };

  const response = await axios.post(baseUrl, newAnecdote);
  return response.data;
}

const changeAnecdote = async (newAnecdote) => {
  await axios.put(`${baseUrl}/${newAnecdote.id}`, newAnecdote);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, createNew, changeAnecdote };