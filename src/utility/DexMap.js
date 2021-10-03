import { default as GameDex } from "../assets/GameDex.json";
import { default as VanillaDex } from "../assets/VanillaDex.json";

const igDexSize = 251 + GameDex.idToName.length; // what if its 252?

class BadID {
  constructor(message) {
    this.message = message;
    this.name = "BadIDException";
  }
}

function idToName(id, igID = false) {
  if (igID && id > 251 && id < igDexSize) {
    // pokemon is an IF custom
    return GameDex["idToName"][id - 252];
  }
  // otherwise just use vanillaDex
  // else if (igID && id <= 251) {
  else {
    return VanillaDex["idToName"][id - 1];
  }
  // throw new BadID(`idToName:${id},${igID ? "true" : "false"}`);
}

// igID says if the output ID should be an in-game pokedex ID or regular pokedex ID
function nameToID(name, igID = false) {
  const processedName = name.toLowerCase();
  if (igID) {
    if (GameDex["nameToID"][processedName] !== undefined)
      return GameDex["nameToID"][processedName];
    else {
      let id = VanillaDex["nameToID"][processedName];
      if (id < 252) return id;

      throw new BadID(`nameToID:${name},${igID ? "true" : "false"}`);
      // return id > 251 ? undefined : id; // id>251: post gen 2 and not in the custom IG pokedex - break something in the caller
    }
  }
  return VanillaDex["nameToID"][name];
}

export { idToName, nameToID };
