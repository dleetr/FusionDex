import React from "react";

function PokemonView({ pokeData }) {
  return pokeData ? (
    <div>
      <h3 className="capitalize">{pokeData.name}</h3>
      <img
        src={pokeData.sprites.front_default}
        alt={pokeData.name}
        className="PokeImage"
      ></img>
    </div>
  ) : null;
}
export default PokemonView;
