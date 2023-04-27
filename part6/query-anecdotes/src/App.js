import { useContext } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { getAnecdotes, changeAnecdote } from "./requests";
import NotificationContext from './NotificationContext';

const App = () => {
  const queryClient = useQueryClient();
  const [notification, dispatch] = useContext(NotificationContext);
  const changeAnecdoteMutation = useMutation(changeAnecdote,  {
    onSuccess: () => {
      queryClient.invalidateQueries("anecdotes");
    }
  });
  
  const handleVote = (anecdote) => {
    changeAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
    dispatch({ type: "SET", payload: `Anecdote '${anecdote.content}' voted` });
    setTimeout(() => {
      dispatch({ type: "RESET" });
    }, 5000);
  }

  const result = useQuery("anecdotes", getAnecdotes);

  if (result.isLoading) {
    return <div>Loading data...</div>
  }

  if (result.isError) {
    return <div>Anecdote service not available due to error on the server</div>
  }

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
