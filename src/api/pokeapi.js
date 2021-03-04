import axios from "axios";

const config = {
  baseURL: "https://pokeapi.co/api/v2/",
  method: "get",
};
export default axios.create(config);
