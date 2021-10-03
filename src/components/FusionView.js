import React from "react";
import { nameToID } from "../utility/DexMap";
const fusionSpritesURL = "https://aegide.github.io/CustomBattlers/";
function FusionView({ headPokeData, bodyPokeData }) {
  if (!headPokeData || !bodyPokeData) return null;
  const getFusionURL = (headMonData, bodyMonData) => {
    const fusionURL =
      fusionSpritesURL +
      (nameToID(headMonData.name, true) +
        "." +
        nameToID(bodyMonData.name, true)) +
      ".png";
    return fusionURL; // 2nd mon is body
  };

  return (
    <img
      src={getFusionURL(headPokeData, bodyPokeData)}
      alt="No fusion found"
      className="FuseImage"
    ></img>
  );
}

export default FusionView;
