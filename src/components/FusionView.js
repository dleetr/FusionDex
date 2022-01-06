import React from "react";
import { useEffect } from "react/cjs/react.development";
import { nameToID } from "../utility/DexMap";
const fusionSpritesURL =
  "https://raw.githubusercontent.com/Aegide/custom-fusion-sprites/main/CustomBattlers/";

function stringify(obj) {
  return JSON.stringify(obj, undefined, 2);
}

function FusionView({ headPokeData, bodyPokeData }) {
  if (!headPokeData || !bodyPokeData) {
    console.error("FusionView missing data");
    throw `FusionView-Warn: Missing 1 of 2 mons:${headPokeData}${bodyPokeData}`;
  }
  const getFusionURL = (headMonData, bodyMonData) => {
    const fusionURL =
      fusionSpritesURL +
      (nameToID(headMonData.name, true) +
        "." +
        nameToID(bodyMonData.name, true)) +
      ".png";
    console.log(fusionSpritesURL);
    return fusionURL; // 2nd mon is body
  };

  useEffect(() => {
    console.log(`Head - \n${stringify(headPokeData)}`);
    console.log(`Body - \n${stringify(bodyPokeData)}`);
  }, [headPokeData, bodyPokeData]);

  return (
    <img
      src={getFusionURL(headPokeData, bodyPokeData)}
      alt="No fusion found"
      className="FuseImage"
    ></img>
  );
}

export default FusionView;
