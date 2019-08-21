import React from 'react';
import './Resources.css';

const Resources = (props)=>{
  let playerResources = props.playerResources;

  let style = {};

  if(!props.show){
    style={'display':'none'};
  }else{
    style={'display':'flex'};
  }

  return (
    <div className="Resources" style={style}>
      <ul>
       { playerResources.map((resource)=>{
         return <li>
                 <p>{resource.amount}</p>
                 <p>x</p>
                 <p id="resourceName">{resource.resource_name}</p>
                </li>
       }) }
      </ul>
    </div>
  );
}

export default Resources;
