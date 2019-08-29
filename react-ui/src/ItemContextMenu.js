import React from 'react';
import { Menu, Item, Separator, Submenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import './ItemContextMenu.css';

const ItemContextMenu = (props)=>{
  return (
    <Menu id="item_menu_id" className="ItemContextMenu">
       <p>{props.item.item_name}</p>
       <Item onClick={()=>{props.useItem(props.item)}}>Use</Item>
       <Item onClick={()=>{console.log('i was clicked')}}>Equip</Item>
    </Menu>
  );
}

export default ItemContextMenu;
