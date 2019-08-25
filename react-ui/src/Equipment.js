import React from 'react';
import HtmlTooltip from './HtmlTooltip';
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
        return <li><p id="slot">{equipmentSlot.equipment_slot_name}</p>
        {equipmentSlot.item_name===null?<p id="item" className="emptyitem">Empty</p>:
        <HtmlTooltip
         title={
           <React.Fragment>
             {equipmentSlot.item_text}
           </React.Fragment>
         }
         placement="top"
       >
        <p id="item">{equipmentSlot.item_name}</p>
       </HtmlTooltip>}
        </li>
      }) }
     </ul>
    </div>
  );
}

export default Equipment;
