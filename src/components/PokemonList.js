import React, { useState, useEffect } from "react";

function PokemonListItem({ pokeData }) {
  return (
    <img
      src={pokeData.sprites.front_default}
      alt={pokeData.name}
      className="PokeImage"
    ></img>
  );
}

/* pokeDataList{
	pokemon1{
		pokeData
	}
}TODO: finish out this outline of the list object we will pass
*/
function PokemonList({ pokeDataList }) {
  const [dataList, setDataList] = useState([]);
  console.log(pokeDataList);
  console.log("^^pokeDataList^^");

  return (
    <ul>
      {pokeDataList.map((pokeData) => (
        <PokemonListItem key={pokeData.id} pokeData={pokeData} />
      ))}
    </ul>
  );
}

export default PokemonList;
