/* eslint-disable import/no-anonymous-default-export */
import { useState } from "react";
import pokeapi from "../api/pokeapi";

const ids = [
  ["Slowking", 199],
  ["Azurill", 252],
  ["Wynaut", 253],
  ["Ambipom", 254],
  ["Mismagius", 255],
  ["Honchkrow", 256],
  ["Bonsly", 257],
  ["Mime-jr", 258],
  ["Happiny", 259],
  ["Munchlax", 260],
  ["Mantyke", 261],
  ["Weavile", 262],
  ["Magnezone", 263],
  ["Lickilicky", 264],
  ["Rhyperior", 265],
  ["Tangrowth", 266],
  ["Electivire", 267],
  ["Magmortar", 268],
  ["Togekiss", 269],
  ["Yanmega", 270],
  ["Leafeon", 271],
  ["Glaceon", 272],
  ["Gliscor", 273],
  ["Mamoswine", 274],
  ["Porygon-z", 275],
  ["Treecko", 276],
  ["Grovyle", 277],
  ["Sceptile", 278],
  ["Torchic", 279],
  ["Combusken", 280],
  ["Blaziken", 281],
  ["Mudkip", 282],
  ["Marshtomp", 283],
  ["Swampert", 284],
  ["Ralts", 285],
  ["Kirlia", 286],
  ["Gardevoir", 287],
  ["Gallade", 288],
  ["Shedinja", 289],
  ["Kecleon", 290],
  ["Beldum", 291],
  ["Metang", 292],
  ["Metagross", 293],
  ["Bidoof", 294],
  ["Spiritomb", 295],
  ["Lucario", 296],
  ["Gible", 297],
  ["Gabite", 298],
  ["Garchomp", 299],
  ["Mawile", 300],
  ["Lileep", 301],
  ["Cradily", 302],
  ["Anorith", 303],
  ["Armaldo", 304],
  ["Cranidos", 305],
  ["Rampardos", 306],
  ["Shieldon", 307],
  ["Bastiodon", 308],
  ["Slaking", 309],
  ["Absol", 310],
  ["Duskull", 311],
  ["Dusclops", 312],
  ["Dusknoir", 313],
  ["Wailord", 314],
  ["Arceus", 315],
  ["Turtwig", 316],
  ["Grotle", 317],
  ["Torterra", 318],
  ["Chimchar", 319],
  ["Monferno", 320],
  ["Infernape", 321],
  ["Piplup", 322],
  ["Prinplup", 323],
  ["Empoleon", 324],
  ["Nosepass", 325],
  ["Probopass", 326],
  ["Honedge", 327],
  ["Doublade", 328],
  ["Aegislash-shield", 329],
  ["Pawniard", 330],
  ["Bisharp", 331],
  ["Luxray", 332],
  ["Aggron", 333],
  ["Flygon", 334],
  ["Milotic", 335],
  ["Salamence", 336],
  ["Klinklang", 337],
  ["Zoroark", 338],
  ["Sylveon", 339],
  ["Kyogre", 340],
  ["Groudon", 341],
  ["Rayquaza", 342],
  ["Dialga", 343],
  ["Palkia", 344],
  ["Giratina-altered", 345],
  ["Regigigas", 346],
  ["Darkrai", 347],
  ["Genesect", 348],
  ["Reshiram", 349],
  ["Zekrom", 350],
  ["Kyurem", 351],
  ["Roserade", 352],
  ["Drifblim", 353],
  ["Lopunny", 354],
  ["Breloom", 355],
  ["Ninjask", 356],
  ["Banette", 357],
  ["Rotom", 358],
  ["Reuniclus", 359],
  ["Whimsicott", 360],
  ["Krookodile", 361],
  ["Cofagrigus", 362],
  ["Galvantula", 363],
  ["Ferrothorn", 364],
  ["Litwick", 365],
  ["Lampent", 366],
  ["Chandelure", 367],
  ["Haxorus", 368],
  ["Golurk", 369],
  ["Pyukumuku", 370],
  ["Klefki", 371],
  ["Talonflame", 372],
  ["Mimikyu-disguised", 373],
  ["Volcarona", 374],
  ["Deino", 375],
  ["Zweilous", 376],
  ["Hydreigon", 377],
  ["Latias", 378],
  ["Latios", 379],
  ["Deoxys-normal", 380],
  ["Jirachi", 381],
  ["Nincada", 382],
  ["Bibarel", 383],
  ["Riolu", 384],
  ["Slakoth", 385],
  ["Vigoroth", 386],
  ["Wailmer", 387],
  ["Shinx", 388],
  ["Luxio", 389],
  ["Aron", 390],
  ["Lairon", 391],
  ["Trapinch", 392],
  ["Vibrava", 393],
  ["Feebas", 394],
  ["Bagon", 395],
  ["Shelgon", 396],
  ["Klink", 397],
  ["Klang", 398],
  ["Zorua", 399],
  ["Budew", 400],
  ["Roselia", 401],
  ["Drifloon", 402],
  ["Buneary", 403],
  ["Shroomish", 404],
  ["Shuppet", 405],
  ["Solosis", 406],
  ["Duosion", 407],
  ["Cottonee", 408],
  ["Sandile", 409],
  ["Krokorok", 410],
  ["Yamask", 411],
  ["Joltik", 412],
  ["Ferroseed", 413],
  ["Axew", 414],
  ["Fraxure", 415],
  ["Golett", 416],
  ["Fletchling", 417],
  ["Fletchinder", 418],
  ["Larvesta", 419],
  ["Stunfisk", 420],
];

export default () => {
  const [results, setResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Call search API when component is first rendered
  // BAD CODE
  //   searchApi('pasta');
  //   useEffect(() => {
  //     searchApi('pasta');
  //   }, []); // the empty array 2nd arg makes this get called on 1st render
  const getInGamePokeID = (pokeData) => {
    let k=0;
    for (k = 0; k < ids.length; k++) {
      if(ids[k][0] == pokeData.name.charAt(0).toUpperCase())
      {

      }
    }
  };
  const searchApi = async (requestType, pokemonNameID, setData) => {
    try {
      const response = await pokeapi.get(
        "/" + requestType + "/" + pokemonNameID.toLowerCase(),
        {
          params: {},
        }
      ); // TODO: make params a switch object to use different params
      console.log("received back data:");
      console.log(response.data);
      getInGamePokeID(response.data);
      // response.data["inGameID"] = getInGamePokeID(response.data)
      setResults(response.data);
      setData(response.data);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Something went wrong");
    }
  };
  return [searchApi, results, errorMessage];
};
