import React from 'react';
import './PersonalInfo.css';

const PersonalInfo = (props)=>{

  let player = props.player;

  let style = {};

  if(!props.show){
    style={'display':'none'};
  }else{
    style={'display':'flex'};
  }

  return (
    <div className="PersonalInfo" style={style}>
      <div className="col-md col-sm PlayerStatColumn">
        <div className="PlayerStatCell">
          <p>Name</p>
          <p className="StatValue">{player.player_name}</p>
        </div>
        <div className="PlayerStatCell">
          <p>Currency</p>
          <p className="StatValue">{player.currency}</p>
        </div>
        <div className="PlayerStatCell">
          <p>Stability</p>
          <p className="StatValue">{player.stability}</p>
        </div>
        <div className="PlayerStatCell">
          <p>Temperature</p>
          <p className="StatValue">{player.average_temperature}°</p>
        </div>
        <div className="PlayerStatCell">
          <p>Alignment</p>
          <p className="StatValue">{player.alignment_id}</p>
        </div>
        <div className="PlayerStatCell">
          <p>Engineering</p>
          <p className="StatValue">{player.engineering}</p>
        </div>
        <div className="PlayerStatCell">
          <p>Theft</p>
          <p className="StatValue">{player.theft}</p>
        </div>
        <div className="PlayerStatCell">
          <p>Intrusion</p>
          <p className="StatValue">{player.intrusion}</p>
        </div>
        <div className="PlayerStatCell">
          <p>Optics</p>
          <p className="StatValue">{player.optics}</p>
        </div>
        <div className="PlayerStatCell">
          <p>Sensors</p>
          <p className="StatValue">{player.sensors}</p>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
