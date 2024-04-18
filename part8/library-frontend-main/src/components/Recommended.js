import { useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { ALL_BOOKS_BY_GENRE, ME } from "../queries";

const Recommended = ({ show }) => {
    const [ getBooks, books ] = useLazyQuery(ALL_BOOKS_BY_GENRE);
    const currentUser = useQuery(ME);

    console.log(currentUser);
    console.log(books);

    useEffect(() => {
        if (currentUser.data) {
            getBooks({ variables: { genre: currentUser.data.me.favoriteGenre }, fetchPolicy: "network-only" });
        }
    }, [currentUser]);

    if (!show) {
        return null;
    }
    
    if (books.loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Recommendations</h2>
            <div>Books in your favourite genre <strong>{currentUser.data.me.favoriteGenre}</strong></div>
            <table>
                <tbody>
                <tr>
                    <th>title</th>
                    <th>author</th>
                    <th>published</th>
                </tr>
                {books.data.allBooks.map((a) => (
                    <tr key={a.title}>
                    <td>{a.title}</td>
                    <td>{a.author.name}</td>
                    <td>{a.published}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Recommended;