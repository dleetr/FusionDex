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
  // const getInGamePokeID = (pokeData) => {
  //   let k=0;
  //   for (k = 0; k < ids.length; k++) {
  //     if(ids[k][0] == pokeData.name.charAt(0).toUpperCase())
  //     {

  //     }
  //   }
  // };
  const searchApi = async (requestType, pokemonNameID, setData = null) => {
    try {
      const response = await pokeapi.get(
        "/" + requestType + "/" + pokemonNameID.toLowerCase(),
        {
          params: {},
        }
      ); // TODO: make params a switch object to use different params
      console.log("received back data:");
      console.log(response.data);
      // getInGamePokeID(response.data);
      // response.data["inGameID"] = getInGamePokeID(response.data)
      setResults(response.data);
      if (setData) setData(response.data);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Something went wrong");
    }
  };
  return [searchApi, results, errorMessage];
};
