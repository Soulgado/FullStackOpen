import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [currentGenre, setCurrentGenre] = useState("");
  const [genres, setGenres]  = useState([]);
  const [currentBooks, setCurrentBooks] = useState([]);
  const books = useQuery(ALL_BOOKS);

  const genreFilter = (genre, books) => {
    return books.filter(book => book.genres.find(genre));
  }

  const listOfGenres = (books) => {
    const genres = new Set();
    books.forEach(book => {
      book.genres.forEach(genre => {
        if (!genres.has(genre)) {
          genres.add(genre);
        };
      });
    });
    return genres;
  }

  if (!props.show) {
    return null
  }

  if (books.loading) {
    return <div>Loading...</div>;
  }

  if (books.networkStatus === 7) {
    setGenres(listOfGenres(books.data.AllBooks));
    setCurrentBooks(books.data.allBooks);
  }

  useEffect(() => {
    setCurrentBooks(genreFilter(currentGenre, currentBooks));
  }, [currentGenre]);

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {currentBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map(genre => {
          return <button onClick={() => setCurrentGenre(genre)}>{genre}</button>;
        })}
        <button onClick={() => setCurrentBooks(books.data.allBooks)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
