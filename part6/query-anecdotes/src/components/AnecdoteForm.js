import { useMutation, useQueryClient } from "react-query";
import { createNew } from "../requests";

const generateId = () =>
  Number((Math.random() * 100000).toFixed(0));

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const newAnecdoteMutation = useMutation(createNew, {
    onSuccess: () => {
      queryClient.invalidateQueries("anecdotes");
    }
  });

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ id: generateId(), content, votes: 0 });
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
