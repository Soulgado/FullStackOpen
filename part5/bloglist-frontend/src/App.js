import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm';
import blogService from './services/blogs'
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username, password
      });
      setUser(user);
      window.localStorage.set("loggedUser", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (error) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  }

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedUser");
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    const blogToAdd = {
      title,
      author,
      url
    };

    try {
      const newBlog = await blogService.create(blogToAdd, user.token);
      setTitle("");
      setAuthor("");
      setUrl("");
      setSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`);
      setTimeout(() => {
        setSuccessMessage(null);
      });
    } catch (error) {
      setErrorMessage("Error creating new blog");
      setTimeout(() => {
        setErrorMessage(null);
      });
    }
  }

  useEffect(() => {
    const storageUser = window.localStorage.getItem("loggedUser");
    if (storageUser) {
      const user = JSON.parse(storageUser);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  if (user === null) {
    return (
      <div>
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    )
  }

  return (
    <div>
      <div>
        {user.username} logged in
        <button type="button" onClick={handleLogout}>Logout</button>
      </div>
      <h2>Create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          <label for="title">Title</label>
          <input 
            type="text"
            value={title}
            name="title"
            id="title"
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">Author</label>
          <input 
            type="text"
            value={author}
            name="author"
            id="title"
            onChange={event => setAuthor(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="url">URL</label>
          <input 
            type="text"
            value={url}
            name="url"
            id="url"
            onChange={event => setUrl(event.target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App