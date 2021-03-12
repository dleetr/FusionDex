import React, { useState, useEffect } from "react";

function PokemonListItem({ pokeData }) {
  return (
    <img
      src={pokeData.spriteURI}
      alt={pokeData.name}
      className="PokeIconImage"
    ></img>
  );
}

/* pokeDataList:	
[{id: pokedexIndex, spriteURI: url, name: str},...]
*/
function PokemonList({ pokeDataList }) {
  return (
    <ul>
      {pokeDataList.map((pokeData) => (
        <PokemonListItem key={pokeData.id} pokeData={pokeData} />
      ))}
    </ul>
  );
}

export default PokemonList;
