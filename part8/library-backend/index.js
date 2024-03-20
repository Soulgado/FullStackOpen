const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { v1: uuid } = require("uuid");

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/Author')
const Book = require("./models/Book")

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`;

// helper functions for filtering books array in functional programming style
function filterByAuthor(listOfBooks, author) {
  return listOfBooks.filter(b => b.author === author);
}

function filterByGenre(listOfBooks, genre) {
  return listOfBooks.filter(b => b.genres.includes(genre) ? b : undefined);
}

const resolvers = {
  Query: {
    authorCount: () => authors.length,
    bookCount: () => books.length,
    allBooks: (root, args) => {
      if (!args.author && !args.genre) {
        return books;
      } else if (!args.author && args.genre) {
        return filterByGenre(books, args.genre);
      } else if (args.author && !args.genre) {
        return filterByAuthor(books, args.author);
      } else {
        return filterByGenre(filterByAuthor(books, args.author), args.genre);
      }
    },
    allAuthors: () => authors,
  },
  Mutation: {
    addBook: (root, args) => {
      const newBook = new Book({ ...args });
      return newBook.save();
    },
    editAuthor: (root, args) => {
      const currentAuthor = authors.find(a => a.name === args.name);
      if (!currentAuthor) return null;

      let updatedAuthor = { ...currentAuthor, born: args.setBornTo };
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a);
      return updatedAuthor;
    }
  },
  Author: {
    bookCount: (root) => {
      let bookCount = 0;
      // book author field matches author name field
      books.forEach(b => b.author === root.name ? bookCount += 1 : null);
      return bookCount;
    },
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
});
