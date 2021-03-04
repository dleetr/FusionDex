import React from "react";

function PokemonView(props) {
  return (
    <div>
      <img src={props.spriteURL} alt={props.name} className="pokeImage"></img>
    </div>
  );
}
export default PokemonView;
