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
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            value={username}
            name="username"
            id="username"
            onChange={event => setUsername(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="text"
            value={password}
            name="password"
            id="password"
            onChange={event => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
}

export default LoginForm;