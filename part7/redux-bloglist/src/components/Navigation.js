import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../reducers/userReducer";

const Navigation = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.users);

  const handleLogout = () => {
    dispatch(removeUser());
  };

  return (
    <nav>
      <Link to="/blogs">Blogs</Link>
      <Link to="/users">Users</Link>
      <div>
        {user.username} logged in
        <button id="logoutButton" type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;