import React from 'react';
import { Menu, Item, Separator, Submenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import './ItemContextMenu.css';

const ItemContextMenu = (props)=>{
  return (
    <Menu id="item_menu_id" className="ItemContextMenu">
       <p>{props.item.item_name}</p>
       {props.item.can_equip ? null : <Item onClick={()=>{props.useItem(props.item)}}>Use</Item>}
       {props.item.can_equip ? <Item onClick={()=>{props.equipItem(props.item)}}>Equip</Item> : null}
    </Menu>
  );
}

export default ItemContextMenu;
