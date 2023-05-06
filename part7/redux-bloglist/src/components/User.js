import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import userService from "../services/users";

const User = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.getUser(id).then((response) => {
      setUser(response);
    });
  });

  if (!user) return null;

  return (
    <>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  );
};

export default User;
