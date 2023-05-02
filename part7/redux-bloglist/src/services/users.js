import axios from "axios";

const baseUrl = "/api/users";

const getUsers = async () => {
  return (await axios.get(baseUrl)).data;
};

export default { getUsers };