import React from "react";
import * as CustomFusions from "../assets/FusionListing.json";
const pokemonNameID = "1";
const fusionID = "1.2";
const fusionSpritesURL = "https://aegide.github.io/CustomBattlers/";
function FusionView({ headPokeData, bodyPokeData }) {
  const getFusionURL = (poke1, poke2) => {
    console.log("Fusion " + poke1.name + poke2.name);
    console.log(poke1);
    console.log(poke2);
    console.log(CustomFusions);
    return fusionSpritesURL + (poke1.id + "." + poke2.id) + ".png"; // 2nd mon is body
  };

  return (
    <div>
      <img
        src={getFusionURL(headPokeData, bodyPokeData)}
        alt="No fusion found"
        className="FuseImage"
      ></img>
    </div>
  );
}

export default FusionView;
