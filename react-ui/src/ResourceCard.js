import React from 'react';
import HtmlTooltip from './HtmlTooltip';
import './ResourceCard.css';
import collectPath from './resources/images/ui/collect.png'

const ResourceCard = (props)=>{
  return (
    <div className="ResourceCard">
      <div className="row ResourceImageRow">
        <img src={ require(`${ props.resource.img_url }`) } />
      </div>
      <div className="row ResourceTitleRow">
          <HtmlTooltip
           title={
             <React.Fragment>
               {props.resource.resource_text}
             </React.Fragment>
           }
           placement="top"
         >
           <p id="resourceName">{props.resource.resource_name}</p>
         </HtmlTooltip>
        <p>{props.resource.target_name}</p>
      </div>
      <div className="row ResourceActionsRow">
        <div className="col-md col-sm ActionColumn">
          <img id="collect" src={collectPath} onClick={()=>{props.collectResource(props.resource.target_name,props.resource.resource_name,props.resource.resource_id)}}/>
        </div>
      </div>
    </div>
  );
}

export default ResourceCard;
