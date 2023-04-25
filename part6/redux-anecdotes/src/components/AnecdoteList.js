import { useDispatch, useSelector } from "react-redux";
import { changeAnecdote } from "../reducers/anecdoteReducer"; 
import { resetNotification, voteMessage } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes);
  const filter = useSelector(state => state.filter);
  const dispatch = useDispatch();

  const vote = (anecdote) => {
    dispatch(changeAnecdote(anecdote.id));
    dispatch(voteMessage(anecdote.content));
    setTimeout(() => {
      dispatch(resetNotification());
    }, 5000);
  };

  return (
    <>
      {anecdotes
        .filter(anecdote => anecdote.content.includes(filter))
        .sort((anecdote1, anecdote2) => anecdote2.votes - anecdote1.votes)
        .map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
      )}
    </>
  );
};

export default AnecdoteList;