import React from 'react';
import HtmlTooltip from './HtmlTooltip';
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
                 <HtmlTooltip
                  title={
                    <React.Fragment>
                      {resource.resource_text}
                    </React.Fragment>
                  }
                  placement="top"
                >
                  <p id="resourceName">{resource.resource_name}</p>
                </HtmlTooltip>
                </li>
       }) }
      </ul>
    </div>
  );
}

export default Resources;
