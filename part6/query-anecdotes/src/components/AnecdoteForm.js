import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { createNew } from "../requests";
import NotificationContext from "../NotificationContext";

const generateId = () =>
  Number((Math.random() * 100000).toFixed(0));

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const [notification, dispatch] = useContext(NotificationContext);
  const newAnecdoteMutation = useMutation(createNew, {
    onSuccess: () => {
      queryClient.invalidateQueries("anecdotes");
    },
    onError: () => {
      dispatch({ type: "SET", payload: `too short anecdote, must have length 5 or more`});
      setTimeout(() => {
        dispatch({ type: "RESET" });
      }, 5000);
    }
  });

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ id: generateId(), content, votes: 0 });
    dispatch({ type: "SET", payload: `Anecdote '${content}' has been created`});
    setTimeout(() => {
      dispatch({ type: "RESET" });
    }, 5000);
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
