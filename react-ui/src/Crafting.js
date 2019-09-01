import React from 'react';
import './Crafting.css';

const Crafting = (props)=>{

  let playerBlueprints = props.playerBlueprints;

  let style = {};

  if(!props.show){
    style={'display':'none'};
  }else{
    style={'display':'flex'};
  }

  return (
    <div className="Crafting" style={style}>
      <ul>
       { playerBlueprints.map((blueprint)=>{
         return (
                  <li onClick={()=>{props.handleOpenBlueprintModal(blueprint)}}>
                   <p>{blueprint.blueprint_name}</p>
                  </li>
                );
       }) }
      </ul>
    </div>
  );

}

export default Crafting;
