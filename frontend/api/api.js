import axios from "axios";

const api = axios.create({
  // baseURL: "http://177.101.4.89:3001",
  // baseURL: "http://192.168.0.101:3001",
  // baseURL: "http://169.254.58.136:3001",
  // baseURL: "http://localhost:3001",
  baseURL: "https://api-arnold.cimerianofficial.com",
});

export default api;
