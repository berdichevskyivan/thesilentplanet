import React from 'react';
import { Menu, Item, Separator, Submenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import './UserContextMenu.css';

const UserContextMenu = (props)=>{
  return (
    <Menu id="menu_id" className="UserContextMenu" onShown={props.handleShowUserContextMenu} onHidden={props.handleHideUserContextMenu}>
       <p>{props.user.username}</p>
       <Item onClick={()=>{props.attackUser(props.user.username,props.user.player_id)}} >Attack</Item>
       <Item onClick={()=>{props.repairUser(props.user.username,props.user.player_id)}}>Repair</Item>
       <Item onClick={()=>{props.stealFromUser(props.user.username,props.user.player_id)}}>Steal</Item>
       <Item onClick={()=>{props.hackUser(props.user.username,props.user.player_id,props.user.attack_power)}}>Hack</Item>
       <Item onClick={()=>{console.log('i was clicked')}}>Trade</Item>
    </Menu>
  );
}

export default UserContextMenu;
