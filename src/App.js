// #region imports
import "./App.css";
import "./assets/pokeicon/icon_sheet.css";

import React, { useState, useEffect, useCallback } from "react";

import useResults from "./hooks/useResults";
import { useToggle } from "./hooks/useToggle";
import InputBox from "./components/InputBox";

import { ToggleSilhouetteButton } from "./components/ToggleSilhouetteButton";
import PokemonView from "./components/PokemonView";
import PokemonList from "./components/PokemonList";
import FusionView from "./components/FusionView";

import { default as CustomFusions } from "./assets/FusionListing.json";
import { idToName, nameToID } from "./utility/DexMap.js";
import { buildFusionsData } from "./utility/buildFusionsData";

import voltorb_bounce from "./assets/voltorb_bounce.png";
// const voltorb_bounce = require("./src/assets/voltorb_bounce.png");
//#endregion

const makePokemonSearcher = (setPokeData, term, searchApi) => {
  return () => {
    try {
      searchApi("pokemon", term, setPokeData);
    } catch (e) {
      console.log("brr");
    }
  };
};

function App() {
  const [term1, setTerm1] = useState("");
  const [term2, setTerm2] = useState("");

  const [pokeData1, setPokeData1] = useState(null);
  const [pokeData2, setPokeData2] = useState(null);

  const [preview, togglePreview] = useToggle(false);

  const [searchApi, results, errorMessage] = useResults();

  return (
    <div className="App">
      <div className="Header">
        <h1>FuSionDeX</h1>
      </div>
      <div className="HeaderSub RetroBorder">
        <h2>
          Spoiler-Free Custom Fusion Lookup for{" "}
          <a href="https://www.pokecommunity.com/showthread.php?t=347883">
            Pokemon Infinite Fusion
          </a>
        </h2>
        <img src={voltorb_bounce}></img>
      </div>
      <div className="DexContent">
        <div className="ToggleSpoiler">
          <p>
            Click to show a silhouette of the fusion sprite. Off by default.
          </p>
        </div>
        <ToggleSilhouetteButton
          preview={preview}
          togglePreview={togglePreview}
        />
        <InputBox
          term={term1}
          onTermChange={setTerm1}
          onTermSubmit={makePokemonSearcher(setPokeData1, term1, searchApi)}
          fusionPart="Head"
        />
        <InputBox
          term={term2}
          onTermChange={setTerm2}
          onTermSubmit={makePokemonSearcher(setPokeData2, term2, searchApi)}
          fusionPart="Body"
        />
      </div>
      <div className="PokemonDiv">
        <PokemonView pokeData={pokeData1} />
        <PokemonView pokeData={pokeData2} />
        <div className="FusionList">
          {pokeData1 && pokeData2 && preview ? (
            <FusionView headPokeData={pokeData1} bodyPokeData={pokeData2} />
          ) : null}
        </div>
      </div>
      {pokeData1 ? (
        <div>
          <h3>Head Fusions</h3>
          <div className="CustomFusionsDiv">
            <PokemonList
              pokeDataList={buildFusionsData(
                CustomFusions[nameToID(pokeData1.name, true)].bodyFusions
              )}
              setPokeData={function s_pData1(data) {
                makePokemonSearcher(setPokeData1, data, searchApi)();
                makePokemonSearcher(setPokeData2, pokeData1.name, searchApi)();
              }}
              head
            />
          </div>
          <h3>Body Fusions</h3>
          <div className="CustomFusionsDiv">
            <PokemonList
              pokeDataList={buildFusionsData(
                CustomFusions[nameToID(pokeData1.name, true)].headFusions
              )}
              setPokeData={function s_pData2(data) {
                makePokemonSearcher(setPokeData2, data, searchApi)(data);
              }}
            />
          </div>
        </div>
      ) : null}

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
    </div>
  );
}

export default App;
