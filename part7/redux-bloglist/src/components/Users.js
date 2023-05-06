import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import userService from "../services/users";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userService.getUsers().then((response) => {
      setUsers(response);
    });
  });

  return (
    <>
      <h2>Users</h2>
      <Table striped>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Users;
