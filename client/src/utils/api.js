import axios from "axios";
import config from "../config.json";

const api = axios.create({
  baseURL: `${config.serverUrl}/`,
  headers: {
    "Content-Type": "application/json",
  }
});

console.log(api.defaults.headers)

export default api;
