import "./App.css";
import React, { useState, useEffect } from "react";
import useResults from "./hooks/useResults";
import InputBox from "./components/InputBox";
import PokemonView from "./components/PokemonView";

function App() {
  const [term, setTerm] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [searchApi, results, errorMessage] = useResults();

  //   const pokemonNameID = "1";

  //   useEffect(() => {
  //     searchApi("pokemon", pokemonNameID);
  //   }, [0]);

  const fusionID = "1.2";
  // eslint-disable-next-line no-unused-vars
  const fusionURL =
    "https://aegide.github.io/CustomBattlers/" + fusionID + ".png";
  console.log("Result Empty if 0: " + results.len);
  return (
    <div className="App">
      <h1>FusionDex</h1>
      <h2>Spoiler Free Custom Fusion Lookup</h2>
      <h3>Enter Pokemon name or Pokedex ID Number</h3>
      <div className="buttonDiv">
        <button
          className="buttonF"
          onClick={() => {
            console.log("Button Click");
          }}
        />
        <InputBox
          term={term}
          onTermChange={setTerm}
          onTermSubmit={() => {
            console.log("GET: " + term);
            searchApi("pokemon", term);
          }}
        />
      </div>
      {results.len > 0 ? (
        <PokemonView
          spriteURL={results.data.sprites.front_default}
          altText={results.data.name}
        />
      ) : null}
    </div>
  );
}

export default App;
