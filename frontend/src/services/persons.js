import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

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
