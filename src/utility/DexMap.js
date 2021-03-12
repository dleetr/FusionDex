import { default as GameDex } from "../assets/GameDex.json";
import { default as VanillaDex } from "../assets/VanillaDex.json";

function idToName(id, igID = false) {
  let igDexSize = 251 + GameDex.idToName.length;
  if (igID && id > 251 && id < igDexSize) {
    // pokemon is an IF custom
    return GameDex["idToName"][id - 252];
  }
  // otherwise just use vanillaDex
  else if (igID && id < 251) {
    // a gen 2 pokemon ID
    return VanillaDex["idToName"][id - 1]; // js arrys 0th'd
  }
  return undefined; // an invalid IG ID was given; so tell the caller
}

// igName refers to the source of the name
// igID says if the ID should be an IG Dex ID or vanilla dex ID
function nameToID(name, igID = false) {
  if (igID) {
    if (GameDex["nameToID"][name] !== undefined)
      return GameDex["nameToID"][name];
    else {
      let id = VanillaDex["nameToID"][name];
      return id > 251 ? undefined : id; // id>2521: post gen 2 and not in the custom IG pokedex - break something in the caller
      // return id;
    }
  }
  return VanillaDex["nameToID"][name];
}

export { idToName, nameToID };
