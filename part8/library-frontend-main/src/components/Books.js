import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [genres, setGenres]  = useState([]);
  const [currentBooks, setCurrentBooks] = useState([]);
  const books = useQuery(ALL_BOOKS);

  const genreFilter = (genre, books) => {
    if (genre === "all") return books;
    return books.filter(book => book.genres.find((bookGenre) => bookGenre === genre));
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
    return Array.from(genres);
  }

  useEffect(() => {
    if (books.networkStatus === 7) {
      setGenres(listOfGenres(books.data.allBooks));
      setCurrentBooks(books.data.allBooks);
    }
  }, [books]);

  const onClickHandler = (genre) => {
    setCurrentBooks(genreFilter(genre, books.data.allBooks));
  }

  if (!props.show) {
    return null
  }

  if (books.loading) {
    return <div>Loading...</div>;
  }

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
          return <button onClick={() => onClickHandler(genre)} key={genre}>{genre}</button>;
        })}
        <button onClick={() => onClickHandler("all")}>all genres</button>
      </div>
    </div>
  )
}

export default Books
