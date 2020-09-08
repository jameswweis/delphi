import axios from "axios";

const instance = axios.create({
  // baseURL: "https://s42v9ebwo9.execute-api.us-east-1.amazonaws.com/dev/"
  // baseURL: "https://djangopaper-273603.appspot.com/"
  baseURL: "https://scaling-science-explore.herokuapp.com/"
});

instance.interceptors.response.use(
  response => Promise.resolve(response.data.results),
  error => Promise.reject(error)
);

export default instance;
