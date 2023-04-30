import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (data, token) => {
  const response = await axios.post(baseUrl, data, {
    headers: {
      "authorization": `Bearer ${token}`
    }
  });
  return response.data;
};

const changeBlog = async (data) => {
  const response = await axios
    .put(`${baseUrl}/${data.id}`, data);
  return response.data;
};

const deleteBlog = async (id, token) => {
  const response = await axios.delete(`${baseUrl}/${id}`, {
    headers: {
      "authorization": `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  getAll,
  create,
  changeBlog,
  deleteBlog,
};