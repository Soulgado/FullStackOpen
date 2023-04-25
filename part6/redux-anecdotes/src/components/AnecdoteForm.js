import { useDispatch } from "react-redux";
import { createNew } from "../reducers/anecdoteReducer";
import { resetNotification, createMessage } from "../reducers/notificationReducer";
import anecdoteService from "../services/anecdotes";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const anecdote = event.target.anecdote.value;
    event.target.anecdote.value = "";
    const createdAnecdote = await anecdoteService.createNew(anecdote);
    dispatch(createNew(createdAnecdote));
    dispatch(createMessage(createdAnecdote));
    setTimeout(() => {
      dispatch(resetNotification());
    }, 5000)
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div><input name="anecdote" type="text"/></div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;