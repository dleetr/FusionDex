import React, { useState, useEffect } from "react";

/* pokeData:	
  {id: pokedexIndex, spriteURI: url, name: str}
*/
function PokemonListItem({ pokeData, setPokeData }) {
  const onClick = () => {
    try {
      setPokeData(pokeData.name);
    } catch (e) {
      console.log(`${setPokeData}\n${e}`);
    }
  };
  return (
    <img
      onClick={onClick}
      src={pokeData.spriteURI}
      alt={pokeData.name}
      className="PokeIconImage"
      onError={() => {
        console.log(`no image for ${pokeData.name} @\n\t${pokeData.spriteURI}`);
      }}
    ></img>
  );
}

/* pokeDataList:	
[{id: pokedexIndex, spriteURI: url, name: str},...]
*/
function PokemonList({ pokeDataList, setPokeData }) {
  return (
    <div className="PokemonList">
      {pokeDataList.map((pokeData) => (
        <PokemonListItem
          key={pokeData.id}
          pokeData={pokeData}
          setPokeData={setPokeData}
        />
      ))}
    </div>
  );
}

export default PokemonList;
