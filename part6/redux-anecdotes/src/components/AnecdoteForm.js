import { useDispatch } from "react-redux";
import { resetNotification, createMessage } from "../reducers/notificationReducer";
import createAnecdote from "../reducers/anecdoteReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const anecdote = event.target.anecdote.value;
    event.target.anecdote.value = "";
    dispatch(createAnecdote(anecdote));
    dispatch(createMessage(anecdote));
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