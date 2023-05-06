import PropTypes from "prop-types";
import { Button, Form } from "react-bootstrap";

const LoginForm = (props) => {
  const {
    handleLogin,
    username,
    setUsername,
    password,
    setPassword
  } = props;

  return (
    <>
      <h2>Log in to application</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            name="username"
            id="username"
            onChange={event => setUsername(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="text"
            value={password}
            name="password"
            id="password"
            onChange={event => setPassword(event.target.value)}
          />
        </Form.Group>
        <Button variant="primary" id="loginButton" type="submit">Login</Button>
      </Form>
    </>
  );
};

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired
};

export default LoginForm;