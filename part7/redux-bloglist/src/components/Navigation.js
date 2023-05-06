import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Navbar, Nav, Button } from "react-bootstrap";
import { removeUser } from "../reducers/userReducer";

const Navigation = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users);

  const handleLogout = () => {
    dispatch(removeUser());
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Nav className="me-auto">
        <Nav.Link href="#" as="span">
          <Link to="/blogs">Blogs</Link>
        </Nav.Link>
        <Nav.Link href="#" as="span">
          <Link to="/users">Users</Link>
        </Nav.Link>
        <Nav.Link href="#" as="span">
          {user ? (
            <em>
              {user.username} logged in{" "}
              <Button
                variant="primary"
                id="logoutButton"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </em>
          ) : (
            <Link to="/login">login</Link>
          )}
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default Navigation;
