import axios from "axios";

const baseUrl = "api/persons";

const getAll = () => axios.get(baseUrl).then((response) => response.data);

const addOne = (personObject) =>
  axios.post(baseUrl, personObject).then((response) => response.data);

const deleteOne = (id) =>
  axios.delete(`${baseUrl}/${id}`).then((response) => response.data);

const updateOne = (id, personObject) =>
  axios.put(`${baseUrl}/${id}`, personObject).then((response) => response.data);

export default { getAll, addOne, deleteOne, updateOne };
