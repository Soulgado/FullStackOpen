import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import NewBlogForm from "./components/NewBlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { setUser, removeUser } from "./reducers/userReducer";
import {
  setBlogs,
  createBlog,
  likeBlog,
  deleteBlog,
} from "./reducers/blogReducer";
import {
  setNotification,
  resetNotification,
} from "./reducers/notificationReducer";


const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const notification = useSelector((state) => state.notifications);
  const user = useSelector((state) => state.users);
  const blogFormRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      dispatch(setUser(user));
      setUsername("");
      setPassword("");
    } catch (error) {
      dispatch(
        setNotification({
          type: "error",
          message: error.response.data.error,
        })
      );
      setTimeout(() => {
        dispatch(resetNotification());
      }, 5000);
    }
  };

  const handleLogout = () => {
    dispatch(removeUser());
  };

  const createNewBlog = async (blogToAdd) => {
    try {
      const newBlog = await blogService.create(blogToAdd, user.token);
      dispatch(createBlog(newBlog));
      dispatch(
        setNotification({
          type: "success",
          message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        })
      );
      blogFormRef.current.toggleVisibility();
      setTimeout(() => {
        dispatch(resetNotification());
      }, 5000);
    } catch (error) {
      dispatch(
        setNotification({
          type: "error",
          message: "Error creating blog",
        })
      );
      setTimeout(() => {
        dispatch(resetNotification());
      }, 5000);
    }
  };

  const handleLikeChange = async (data) => {
    try {
      const changedBlog = await blogService.changeBlog(data);
      dispatch(likeBlog(changedBlog));
    } catch (error) {
      dispatch(
        setNotification({
          type: "error",
          message: "Error occured while changing amount of likes",
        })
      );
      setTimeout(() => {
        dispatch(resetNotification());
      }, 5000);
    }
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.deleteBlog(blog.id, user.token);
        dispatch(deleteBlog(blog.id));
        dispatch(
          setNotification({
            type: "success",
            message: "Blog has been successfully removed",
          })
        );
        setTimeout(() => {
          dispatch(resetNotification());
        }, 5000);
      } catch (error) {
        dispatch(
          setNotification({
            type: "error",
            message: "Error occured while changing deleting blog",
          })
        );
        setTimeout(() => {
          dispatch(resetNotification());
        }, 5000);
      }
    }
  };

  useEffect(() => {
    const storageUser = window.localStorage.getItem("loggedBlogAppUser");
    if (storageUser) {
      const user = JSON.parse(storageUser);
      dispatch(setUser(user));
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)));
  }, []);

  if (user === null) {
    return (
      <div>
        <Notification info={notification} />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    );
  }

  return (
    <div>
      <div>
        {user.username} logged in
        <button id="logoutButton" type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <Notification info={notification} />
      <Togglable buttonLabel="Create new Blog" ref={blogFormRef}>
        <NewBlogForm createNewBlog={createNewBlog} />
      </Togglable>
      <h2>blogs</h2>
      <div className="bloglist">
        {[...blogs].sort((blog1, blog2) => blog2.likes - blog1.likes).map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            currentUser={user}
            handleLikeClick={handleLikeChange}
            handleDeleteClick={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
