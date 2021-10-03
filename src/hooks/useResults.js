import { useState } from "react";
import pokeapi from "../api/pokeapi";

export default () => {
  const [results, setResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const searchApi = async (requestType, pokemonNameID, setData = null) => {
    try {
      const response = await pokeapi.get(
        "/" + requestType + "/" + pokemonNameID.toLowerCase(),
        {
          params: {},
        }
      );
      console.log("received back data:");
      console.log(response.data);
      // getInGamePokeID(response.data);
      // response.data["inGameID"] = getInGamePokeID(response.data)
      setResults(response.data);
      if (setData) setData(response.data);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(`Potentially bad call: ${pokemonNameID}`);
    }
  };
  return [searchApi, results, errorMessage];
};
