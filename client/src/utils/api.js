import axios from "axios";
import useUser from "./useUser";
import config from "../config.json";

const api = axios.create({
  baseURL: `${config.serverUrl}/`,
  headers: {
    "Content-Type": "application/json",
  }
});
/**
 intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
 **/

api.interceptors.response.use(
  res => res,
  err => {
    if (Number(err.response.status) === 401) {
      const {unsetUser} = useUser();
      unsetUser();
    }
    return Promise.reject(err);
  }
);

export default api;