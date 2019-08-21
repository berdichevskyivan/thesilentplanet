import React from 'react';
import './Items.css';

const Items = (props)=>{

  let playerItems = props.playerItems;

  let style = {};

  if(!props.show){
    style={'display':'none'};
  }else{
    style={'display':'flex'};
  }

  return (
    <div className="Items" style={style}>
      <ul>
       { playerItems.map((item)=>{
         return <li>
                 <p>{item.amount}</p>
                 <p>x</p>
                 <p id="itemName">{item.item_name}</p>
                </li>
       }) }
      </ul>
    </div>
  );
}

export default Items;
