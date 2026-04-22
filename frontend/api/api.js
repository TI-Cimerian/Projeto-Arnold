import axios from "axios";

const api = axios.create({
  // baseURL: "http://177.101.4.89:3001",
  baseURL: "http://192.168.0.101:3001",
  // baseURL: 'http://localhost:3001',
});

export default api;
