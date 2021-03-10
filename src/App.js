import "./App.css";
import React, { useState, useEffect } from "react";
import useResults from "./hooks/useResults";
import InputBox from "./components/InputBox";
import PokemonView from "./components/PokemonView";
import PokemonList from "./components/PokemonList";
import FusionView from "./components/FusionView";

function App() {
  const [term1, setTerm1] = useState("");
  const [term2, setTerm2] = useState("");
  const [pokeData1, setPokeData1] = useState(null);
  const [pokeData2, setPokeData2] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [searchApi, results, errorMessage] = useResults();
  //   console.log(pokeData1);
  //   console.log(pokeData2);

  // TODO: Figure out if should
  // - use github api
  // - read from file
  // - read directly from directory

  return (
    <div className="App">
      <h1>FusionDex</h1>
      <h2>Spoiler Free Custom Fusion Lookup for Pokemon Infinite Fusion</h2>
      <h3>Enter Pokemon name or Pokedex ID Number</h3>
      <h4>
        Note -{" "}
        <a href="https://infinitefusion.fandom.com/wiki/Pok%C3%A9dex">
          Infinite Fusion has custom Pokedex IDs beyond Gen 2
        </a>{" "}
        - if something is broken this is a likely culprit. <br />
        If you find something that is broken please{" "}
        <a href="https://github.com/dleetr/FusionDex/issues">
          report it on Github
        </a>
      </h4>
      <div className="buttonDiv">
        <p>
          Toggle to show a blacked out silhouette of the fusion sprite. Off by
          default
        </p>
        <button
          className="PreviewButton"
          onClick={() => {
            setShowPreview(!showPreview);
          }}
        />
        <InputBox
          term={term1}
          onTermChange={setTerm1}
          onTermSubmit={() => {
            console.log("GET: " + term1);
            searchApi("pokemon", term1, setPokeData1);
          }}
        />
        <InputBox
          term={term2}
          onTermChange={setTerm2}
          onTermSubmit={() => {
            console.log("GET: " + term2);
            searchApi("pokemon", term2, setPokeData2);
          }}
        />
      </div>
      <div className="PokemonDiv">
        {pokeData1 ? <PokemonView pokeData={pokeData1} /> : null}
        {pokeData2 ? <PokemonView pokeData={pokeData2} /> : null}
      </div>
      <div className="FusionList">
        {pokeData1 && pokeData2 && showPreview ? (
          <FusionView
            headPokeData={pokeData1}
            bodyPokeData={pokeData2}
          ></FusionView>
        ) : null}
      </div>
    </div>
  );
}

export default App;
