import React from 'react';
import { Menu, Item, Separator, Submenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import './UserContextMenu.css';

const UserContextMenu = (props)=>{
  return (
    <Menu id="menu_id" className="UserContextMenu" onShown={props.handleShowUserContextMenu} onHidden={props.handleHideUserContextMenu}>
       <p>{props.user.username}</p>
       <Item onClick={()=>{props.attackUser(props.user.username,props.user.player_id)}} >Attack</Item>
       <Item onClick={()=>{console.log('i was clicked')}}>Repair</Item>
       <Item onClick={()=>{console.log('i was clicked')}}>Steal</Item>
       <Item onClick={()=>{console.log('i was clicked')}}>Hack</Item>
       <Item onClick={()=>{console.log('i was clicked')}}>Trade</Item>
    </Menu>
  );
}

export default UserContextMenu;
