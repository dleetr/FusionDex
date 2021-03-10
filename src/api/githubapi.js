// https://api.github.com
import axios from "axios";

const config = {
  baseURL: "https://api.github.com",
  method: "get",
};
export default axios.create(config);
