import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

const getAll = () => {
  return axios.get(`${baseURL}/api/persons`);
};

const create = (personObject) => {
  return axios.post(`${baseURL}/api/persons`, personObject);
};

const omit = (id) => {
  return axios.delete(`${baseURL}/api/persons/${id}`);
};

const update = (id, personObject) => {
  return axios.put(`${baseURL}/api/persons/${id}`, personObject);
};

const personsService = {
  getAll,
  create,
  omit,
  update,
};

export default personsService;
