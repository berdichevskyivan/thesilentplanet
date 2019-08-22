import React from 'react';
import './ResourceCard.css';
import collectPath from './resources/images/ui/collect.png'

const ResourceCard = (props)=>{
  return (
    <div className="ResourceCard">
      <div className="row ResourceImageRow">
        <img src={ require(`${ props.resource.img_url }`) } />
      </div>
      <div className="row ResourceTitleRow">
        <p>{props.resource.resource_name}</p>
        <p>{props.resource.target_name}</p>
      </div>
      <div className="row ResourceActionsRow">
        <div className="col-md col-sm ActionColumn">
          <img id="collect" src={collectPath} />
        </div>
      </div>
    </div>
  );
}

export default ResourceCard;
