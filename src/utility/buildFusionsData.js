import { idToName, nameToID } from "./DexMap";

export const pokeIconsURI =
  "https://raw.githubusercontent.com/arcanis/pikasprite/master/icons/pokemon/regular/";

export const buildFusionsData = (fusionIDList) => {
  // 227-256 (skarmory-honchkrow)
  // console.log(`building fusion data with list: ${fusionIDList}`);
  // fusionIDList: [1,31,33] -> pokedex IDs
  const fusionsData = [];
  for (let i = 0; i < fusionIDList.length; i++) {
    const fusionData = {};
    fusionData["name"] = idToName(fusionIDList[i], true);
    // because we need an out of game ID for building the URI
    try {
      fusionData["id"] = nameToID(fusionData["name"], true);
    } catch (error) {
      console.log(
        `=================\nError building fusion data: \n${
          fusionIDList[i]
        }\n ${idToName(
          fusionIDList[(fusionIDList[i], true)]
        )}, \n\tfusionData.name:${fusionData.name}\n\t\ ${fusionIDList}`
      );
    }
    try {
      fusionData["spriteURI"] = `${pokeIconsURI}${fusionData[
        "name"
      ].toLowerCase()}.png`;
    } catch (error) {
      console.log("Type Error");
    }
    fusionsData.push(fusionData);
  }
  console.log(fusionsData);
  return fusionsData.sort((a, b) => a.id - b.id);
};
