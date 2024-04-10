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
    addAuthor(
      name: String!
      born: Int
    )
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
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({});
      } else if (!args.author && args.genre) {
        return Book.find({ genre: args.genre });
      } else if (args.author && !args.genre) {
        return Book.find({ author: args.author });
      } else {
        return Book.find({ author: args.author, genre: args.genre });
      }
    },
    allAuthors: async () => Author.find({}),
  },
  Mutation: {
    addAuthor: async (root, args) => {
      const newAuthor = new Author({ ...args });

      try {
        await newAuthor.save();
      } catch (error) {
        throw new GraphQLError("Saving author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error
          }
        });
      }

      return newAuthor;
    },
    addBook: async (root, args) => {
      const newBook = new Book({ ...args });

      try {
        await newBook.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error
          }
        });
      }
      return newBook;
    },
    editAuthor: async (root, args) => {
      const currentAuthor = await Author.find({ name: args.name });
      currentAuthor.born = args.setBornTo;

      try {
        await currentAuthor.save();
      } catch (error) {
        throw new GraphQLError("Changing author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.setBornTo,
            error
          }
        });
      }

      return currentAuthor;
    }
  },
  Author: {
    bookCount: async (root) => {
      return Book.collection.countDocuments({ author: root.name });
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
