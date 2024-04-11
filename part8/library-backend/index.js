const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { v1: uuid } = require("uuid");
const jwt = require("jsonwebtoken");

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Author = require('./models/Author');
const Book = require("./models/Book");
const User = require("./models/User");

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  });

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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addAuthor(
      name: String!
      born: Int
    ): Author
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
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
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
        const books = await Book.find({}).populate("author");
        return books;
      } else if (!args.author && args.genre) {
        return Book.find({ genre: args.genre }).populate("author");
      } else if (args.author && !args.genre) {
        return Book.find({ author: args.author }).populate("author");
      } else {
        return Book.find({ author: args.author, genre: args.genre }).populate("author");
      }
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser;
    }
  },
  Mutation: {
    addAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        });
      }
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
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        });
      }
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
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        });
      }
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
    },
    createUser: async (root, args) => {
      const newUser = new User({ ...args });
      return newUser.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          });
        });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      
      if ( !user || args.password !== "password" ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });      
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return jwt.sign(userForToken, process.env.JWT_SECRET);
    },
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
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
});
