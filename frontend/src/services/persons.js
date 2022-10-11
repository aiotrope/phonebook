import axios from "axios";

const baseURL = "http://127.0.0.1:3001/api/persons"

const getAll = () => {
  return axios.get(baseURL);
};

const create = (personObject) => {
  return axios.post(baseURL, personObject);
};

const omit = (id) => {
  return axios.delete(`${baseURL}/${id}`);
};

const update = (id, personObject) => {
  return axios.put(`${baseURL}/${id}`, personObject);
};

const personsService = {
  getAll,
  create,
  omit,
  update,
};

export default personsService;
