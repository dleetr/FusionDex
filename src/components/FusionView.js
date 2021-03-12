import React from "react";
const fusionSpritesURL = "https://aegide.github.io/CustomBattlers/";
function FusionView({ headPokeData, bodyPokeData }) {
  const getFusionURL = (headMonData, bodyMonData) => {
    const fusionURL =
      fusionSpritesURL + (headMonData.id + "." + bodyMonData.id) + ".png";
    return fusionURL; // 2nd mon is body
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
