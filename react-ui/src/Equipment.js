import React from 'react';
import './Equipment.css';

const Equipment = (props)=>{

  let playerEquipment = props.playerEquipment;

  let style = {};

  if(!props.show){
    style={'display':'none'};
  }else{
    style={'display':'flex'};
  }

  return (
    <div className="Equipment" style={style}>
     <ul>
      { playerEquipment.map((equipmentSlot)=>{
        return <li><p id="slot">{equipmentSlot.equipment_slot_name}</p><p id="item">{equipmentSlot.item_name===null?'Empty':equipmentSlot.item_name}</p></li>
      }) }
     </ul>
    </div>
  );
}

export default Equipment;
