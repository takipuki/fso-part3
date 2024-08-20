import axios from 'axios';

const baseURL = '/api/persons/'

function getAll() {
  return axios
    .get(baseURL)
    .then(res => res.data);
}

function add(person) {
  return axios
    .post(baseURL, person)
    .then(res => res.data);
}

function remove(person) {
  return axios
    .delete(baseURL + person.id)
    .then(res => res.data);
}

function update(person) {
  return axios
    .put(baseURL + person.id, person)
    .then(res => res.data);
}

export default { getAll, add, remove, update };
