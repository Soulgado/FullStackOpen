import axios from "axios";

const baseUrl = "/api/users";

const getUsers = async () => {
  return (await axios.get(baseUrl)).data;
};

const getUser = async (id) => {
  return (await axios.get(`${baseUrl}/${id}`)).data;
};

export default { getUsers, getUser };
