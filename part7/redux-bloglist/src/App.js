import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Users from "./components/Users";
import Blog from "./components/Blog";
import BlogList from "./components/BlogList";
import User from "./components/User";
import Navigation from "./components/Navigation";
import loginService from "./services/login";
import { setUser } from "./reducers/userReducer";
import {
  setNotification,
  resetNotification,
} from "./reducers/notificationReducer";

const App = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notifications);
  const user = useSelector((state) => state.users);
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

  useEffect(() => {
    const storageUser = window.localStorage.getItem("loggedBlogAppUser");
    if (storageUser) {
      const user = JSON.parse(storageUser);
      dispatch(setUser(user));
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
      <Navigation />
      <Routes>
        <Route to="/" element={<BlogList />} />
        <Route to="/users" element={<Users />} />
        <Route to="/users/:id" element={<User />} />
        <Route to="/blogs/:id" element={<Blog />} />
      </Routes>
    </div>
  );
};

export default App;
