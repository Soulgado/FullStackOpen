import { useQuery } from "@apollo/client";
import { ME, ALL_BOOKS_BY_GENRE } from "../queries";

const Recommended = (props) => {
    const [books, setBooks] = useState([]);

    const currentUser = useQuery(ME, {
        onCompleted: (result) => {
            const booksData = useQuery(ALL_BOOKS_BY_GENRE, {
                variables: {
                    genre: result.data.me.favoriteGenre
                }
            });
            setBooks(booksData.data.allBooks);
        }
    });

    if (!props.show) {
        return null
    }
    
    if (currentUser.loading || books.loading) {
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
                {books.map((a) => (
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