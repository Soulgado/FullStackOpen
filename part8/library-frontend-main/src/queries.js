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
            author
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
