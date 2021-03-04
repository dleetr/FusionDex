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
  //   }, []);

  const fusionID = "1.2";
  // eslint-disable-next-line no-unused-vars
  const fusionURL =
    "https://aegide.github.io/CustomBattlers/" + fusionID + ".png";
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
      {results ? (
        <PokemonView
          spriteURL={results.sprites.front_default}
          altText={results.name}
        />
      ) : null}
    </div>
  );
}

export default App;
