import { useState, useEffect, useRef, useContext } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import NewBlogForm from "./components/NewBlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { useQuery, useMutation, useQueryClient } from "react-query";
import NotificationContext from "./NotificationContext";
import UserContext from "./UserContext";

const App = () => {
  const queryClient = useQueryClient();
  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries("blogs");
    },
  });
  const likeBlogMutation = useMutation(blogService.changeBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries("blogs");
    },
  });
  const deleteBlogMutation = useMutation(blogService.deleteBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries("blogs");
    },
  });
  const [notification, dispatch] = useContext(NotificationContext);
  const [user, userDispatch] = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const blogFormRef = useRef();

  const result = useQuery("blogs", blogService.getAll);
  const blogs = result.isLoading ? [] : result.data;

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      userDispatch({ type: "LOGIN", payload: user });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (error) {
      dispatch({
        type: "SET",
        payload: {
          type: "error",
          message: error.response.data.error,
        },
      });
      setTimeout(() => {
        dispatch({ type: "RESET" });
      }, 5000);
    }
  };

  const handleLogout = () => {
    userDispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("loggedBlogAppUser");
  };

  const createNewBlog = async (blogToAdd) => {
    try {
      newBlogMutation.mutate({ data: blogToAdd, token: user.token });
      dispatch({
        type: "SET",
        payload: {
          type: "success",
          message: `a new blog ${blogToAdd.title} by ${blogToAdd.author} added`,
        },
      });
      blogFormRef.current.toggleVisibility();
      setTimeout(() => {
        dispatch({ type: "RESET" });
      }, 5000);
    } catch (error) {
      dispatch({
        type: "SET",
        payload: {
          type: "error",
          message: "Error creating blog",
        },
      });
      setTimeout(() => {
        dispatch({ type: "RESET" });
      }, 5000);
    }
  };

  const handleLikeChange = async (data) => {
    try {
      likeBlogMutation.mutate(data);
    } catch (error) {
      dispatch({
        type: "SET",
        payload: {
          type: "error",
          message: "Error occured while changing amount of likes",
        },
      });
      setTimeout(() => {
        dispatch({ type: "RESET" });
      }, 5000);
    }
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        deleteBlogMutation.mutate({ id: blog.id, token: user.token });
        dispatch({
          type: "SET",
          payload: {
            type: "success",
            message: "Blog has been successfully removed",
          },
        });
        setTimeout(() => {
          dispatch({ type: "RESET" });
        }, 5000);
      } catch (error) {
        dispatch({
          type: "SET",
          payload: {
            type: "error",
            message: "Error occured while deleting blog",
          },
        });
        setTimeout(() => {
          dispatch({ type: "RESET" });
        }, 5000);
      }
    }
  };

  useEffect(() => {
    const storageUser = window.localStorage.getItem("loggedBlogAppUser");
    if (storageUser) {
      const user = JSON.parse(storageUser);
      userDispatch({ type: "LOGIN", payload: user });
    }
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
        {blogs
          .sort((blog1, blog2) => blog2.likes - blog1.likes)
          .map((blog) => (
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
