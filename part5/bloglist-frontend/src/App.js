import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm';
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import NewBlogForm from "./components/NewBlogForm";
import blogService from './services/blogs'
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationInfo, setNotificationInfo] = useState({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username, password
      });
      setUser(user);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (error) {
      setNotificationInfo({ 
        type: "error",
        message: error.response.data.error
      });
      setTimeout(() => {
        setNotificationInfo({});
      }, 5000);
    }
  }

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedBlogAppUser");
  }

  const createNewBlog = async (blogToAdd) => {
    try {
      const newBlog = await blogService.create(blogToAdd, user.token);
      setBlogs(blogs.concat(newBlog));
      setNotificationInfo({
        type: "success",
        message: `a new blog ${newBlog.title} by ${newBlog.author} added`
      });
      blogFormRef.current.toggleVisibility();
      setTimeout(() => {
        setNotificationInfo({});
      }, 5000);
    } catch (error) {
      setNotificationInfo({
        type: "error",
        message: error.response.data.error
      });
      setTimeout(() => {
        setNotificationInfo({});
      }, 5000);
    }
  }

  const handleLikeChange = async (data) => {
    try {
      const changedBlog = await blogService.changeBlog(data);
      const newListOfBlogs = blogs.filter(blog => blog.id !== changedBlog.id)
      setBlogs(newListOfBlogs.concat(changedBlog));
    } catch (error) {
      setNotificationInfo({
        type: "error",
        message: "Error occured while changing amount of likes"
      });
      setTimeout(() => {
        setNotificationInfo({});
      }, 5000);
    }
  }

  useEffect(() => {
    const storageUser = window.localStorage.getItem("loggedBlogAppUser");
    if (storageUser) {
      const user = JSON.parse(storageUser);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, []);

  if (user === null) {
    return (
      <div>
        <Notification info={notificationInfo} />
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
      <Notification info={notificationInfo} />
      <Togglable buttonLabel="Create new Blog" ref={blogFormRef}>
        <NewBlogForm createNewBlog={createNewBlog} />
      </Togglable>
      <h2>blogs</h2>
      {blogs.sort((blog1, blog2) => blog2.likes - blog1.likes).map(blog =>
        <Blog key={blog.id} blog={blog} handleLikeClick={handleLikeChange} />
      )}
    </div>
  )
}

export default App