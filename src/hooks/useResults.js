/* eslint-disable import/no-anonymous-default-export */
import { useState } from "react";
import pokeapi from "../api/pokeapi";

export default () => {
  const [results, setResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Call search API when component is first rendered
  // BAD CODE
  //   searchApi('pasta');
  //   useEffect(() => {
  //     searchApi('pasta');
  //   }, []); // the empty array 2nd arg makes this get called on 1st render

  const searchApi = async (requestType, pokemonNameID) => {
    try {
      const response = await pokeapi.get(
        "/" + requestType + "/" + pokemonNameID,
        {
          params: {},
        }
      ); // TODO: make params a switch object to use different params
      console.log("received back data:");
      console.log(response.data);
      setResults(response.data);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Something went wrong");
    }
  };
  return [searchApi, results, errorMessage];
};
