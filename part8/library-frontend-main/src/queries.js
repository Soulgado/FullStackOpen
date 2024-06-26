import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`;

export const ALL_BOOKS = gql`
    query {
        allBooks {
            title
            published
            genres
            author {
                name
            }
        }
    }
`;

export const ALL_BOOKS_BY_GENRE = gql`
    query booksByGenre($genre: String!) {
        allBooks(genre: $genre) {
            title
            published
            genres
            author {
                name
            }
        }
    }
`;

export const ADD_BOOK = gql`
    mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(
            title: $title,
            author: $author,
            published: $published,
            genres: $genres
        ) {
            title
            author
            published
        }
    }
`;

export const EDIT_BIRTHYEAR = gql`
    mutation editBirthYear($name: String!, $born: Int!) {
        editAuthor(
            name: $name,
            setBornTo: $born
        ) {
            name
            born
        }
    }
`;

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(
            username: $username,
            password: $password
        ) {
            value
        }
    }
`;

export const ME = gql`
    query {
        me {
            username
            favoriteGenre
        }
    }
`;

