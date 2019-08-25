import React from 'react';
import HtmlTooltip from './HtmlTooltip';
import './ZoneInfo.css';

const ZoneInfo = (props)=>{
  let style = {};

  let zone = props.zone;

  if(!props.show){
    style={'display':'none'};
  }else{
    style={'display':'flex'};
  }

  return (
    <div className="ZoneInfo" style={style}>
      <div className="col-md col-sm PlayerStatColumn">
        <div className="PlayerStatCell">
          <p>Name</p>
          <HtmlTooltip
           title={
             <React.Fragment>
               {zone.zone_text}
             </React.Fragment>
           }
           placement="right"
         >
           <p className="StatValue" id="zoneName">{zone.zone_name}</p>
         </HtmlTooltip>

        </div>
        <div className="PlayerStatCell">
          <p>Location</p>
          <p className="StatValue">{zone.zone_location}</p>
        </div>
        <div className="PlayerStatCell">
          <p>Temperature</p>
          <p className="StatValue">{zone.zone_temperature}°</p>
        </div>
        <div className="PlayerStatCell">
          <p>Type</p>
          <p className="StatValue">{zone.zone_type}</p>
        </div>
        <div className="PlayerStatCell">
          <p>EM Disturbance</p>
          <p className="StatValue">{zone.zone_em_disturbance}</p>
        </div>
      </div>
    </div>
  );
}

export default ZoneInfo;
