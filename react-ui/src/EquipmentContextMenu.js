import React from 'react';
import { Menu, Item, Separator, Submenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import './EquipmentContextMenu.css';

const EquipmentContextMenu = (props)=>{
  return (
    <Menu id="equipment_menu_id" className="EquipmentContextMenu">
       <p>{props.equipment.item_name}</p>
       <Item onClick={()=>{props.unequipItem(props.equipment)}}>Unequip</Item>
    </Menu>
  );
}

export default EquipmentContextMenu;
