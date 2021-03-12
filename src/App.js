import "./App.css";
import React, { useState, useEffect } from "react";
import useResults from "./hooks/useResults";
import InputBox from "./components/InputBox";
import PokemonView from "./components/PokemonView";
import PokemonList from "./components/PokemonList";
import FusionView from "./components/FusionView";
import { default as CustomFusions } from "./assets/FusionListing.json";
import { idToName, nameToID } from "./utility/DexMap.js";
function App() {
  const [term1, setTerm1] = useState("");
  const [term2, setTerm2] = useState("");
  const [pokeData1, setPokeData1] = useState(null);
  const [pokeData2, setPokeData2] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [searchApi, results, errorMessage] = useResults();

  // console.log(CustomFusions.default[4].headFusions);
  const pokeIconsURI =
    "https://raw.githubusercontent.com/arcanis/pikasprite/master/icons/pokemon/regular/";

  const buildFusionsData = (fusionIDList) => {
    // fusionIDList: [1,31,33] -> pokedex IDs
    // fusionIDList
    const fusionsData = [];
    let i = 0;
    for (; i < fusionIDList.length; i++) {
      const fusionData = {};
      fusionData["name"] = idToName(fusionIDList[i], true);
      fusionData["id"] = nameToID(fusionData["name"], false); // because we need an out of game ID for building the URI
      fusionData["spriteURI"] =
        pokeIconsURI + fusionData["name"].toLowerCase() + ".png";
      fusionsData.push(fusionData);
    }
    console.log(fusionsData);
    return fusionsData.sort((a, b) => {
      return a.id - b.id;
    });
  };

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
            searchApi("pokemon", term1, setPokeData1);
          }}
        />
        <InputBox
          term={term2}
          onTermChange={setTerm2}
          onTermSubmit={() => {
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
      {pokeData1 ? (
        <div>
          <h3>Head Fusions</h3>
          <div className="CustomFusionsDiv">
            <PokemonList
              pokeDataList={buildFusionsData(
                CustomFusions[nameToID(pokeData1.name, true)].headFusions
              )}
            />
          </div>
          <h3>Body Fusions</h3>
          <div className="CustomFusionsDiv">
            <PokemonList
              pokeDataList={buildFusionsData(
                CustomFusions[nameToID(pokeData1.name, true)].bodyFusions
              )}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
/* pokeDataList:	
[{id: pokedexIndex, spriteURI: url, name: str},...]
*/
export default App;
