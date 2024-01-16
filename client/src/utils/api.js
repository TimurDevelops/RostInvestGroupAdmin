import axios from "axios";
import config from "../config.json";

const api = axios.create({
  baseURL: `${config.serverUrl}/`,
  headers: {
    "Content-Type": "application/json",
  }
});

export default api;
