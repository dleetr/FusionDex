const path = require("path");
const fs = require("fs");

const pokespritePath = require("pokesprite-images").baseDir;
const spritePath = path.join(pokespritePath, "pokemon-gen8", "regular/");

exports.spritePath = spritePath;

const readJSONSync = (filePath) =>
  JSON.parse(fs.readFileSync(path.resolve(filePath)));

const pokespriteDex = readJSONSync(`${pokespritePath}/data/pokemon.json`);
const vanillaDex = readJSONSync("./src/assets/VanillaDex.json");
const gameDex = readJSONSync("./src/assets/GameDex.json");

// Functions are used instead of arrow functions because there is no arrow style generator function

// ex. getPokespriteBaseName("001")
function getPokespriteBaseName(pokedexID) {
  const mon = pokespriteDex[pokedexID];
  const basename = mon.slug.eng;
  return basename;
}

function fullPath(baseName) {
  return `${spritePath}${baseName}.png`;
}

function* getCustomDexBaseNames() {
  for (let i = 0; i < gameDex.idToName.length; i++) {
    yield fullPath(
      getPokespriteBaseName(vanillaDex.nameToID[gameDex.idToName[i]])
    ); // no need to pad 0s here as all the IDs are >099
  }
}

exports.getFusionDexSpritePaths = function* getFusionDexSpritePaths() {
  for (let i = 1; i < 252; i++) {
    yield fullPath(getPokespriteBaseName(i.toString().padStart(3, "0"))); // pokesprite mon info: "00X"
  }
  yield* getCustomDexBaseNames();
};
