import React from 'react';
import './EnemyCard.css';
import crosshairPath from './resources/images/ui/crosshair.png';
import repairPath from './resources/images/ui/repair.png';
import talkPath from './resources/images/ui/talk.png';
import theftPath from './resources/images/ui/theft.png';
import tradePath from './resources/images/ui/trade.png';

const EnemyCard = (props)=>{

  var percentage = (props.npc.current_stability * 100) / props.npc.stability ;
  var style = {};

  if(percentage <= 100 && percentage > 90){
    style={
      'background':'lime'
    }
  }else if(percentage <= 90 && percentage > 80){
    style={
      'background':'#9bff00'
    }
  }else if(percentage <= 80 && percentage > 70){
    style={
      'background':'#e2ff00'
    }
  }else if(percentage <= 70 && percentage > 60){
    style={
      'background':'#ffed00'
    }
  }else if(percentage <= 60 && percentage > 50){
    style={
      'background':'#ffbe00'
    }
  }else if(percentage <= 50 && percentage > 40){
    style={
      'background':'#ff8300',
      'color':'white'
    }
  }else if(percentage <= 40 && percentage > 30){
    style={
      'background':'#ff6000',
      'color':'white'
    }
  }else if(percentage <= 30 && percentage > 20){
    style={
      'background':'#ff4800',
      'color':'white'
    }
  }else if(percentage <= 20 && percentage > 10){
    style={
      'background':'#ff1900',
      'color':'white'
    }
  }else if(percentage <= 10 && percentage > 0){
    style={
      'background':'#ff0000',
      'color':'white'
    }
  }

  style.width = percentage+'%';

  return (
    <div className="EnemyCard">
      <div className="row EnemyImageRow">
        <img src={ require(`${ props.npc.img_url }`) } />
      </div>
      <div className="row EnemyTitleRow">
        <p>{props.npc.npc_name}</p>
        <p>{props.npc.target_name}</p>
      </div>
      <div className="row EnemyStatsRow">
        <div className="row StabilityBar" style={style}>
          <p>{props.npc.current_stability}/{props.npc.stability}</p>
        </div>
        <div className="row StatsBar">
          <div className="col-md-12 col-sm-12 StatColumn">
            <img src={crosshairPath} />
            <p>{ props.npc.attack_power }</p>
          </div>
        </div>
      </div>
      <div className="row EnemyActionsRow">
        <div className="col-md col-sm ActionColumn">
          <img id="attack" src={crosshairPath} onClick={()=>{props.attackNpc(props.npc.target_name)}} />
        </div>
        <div className="col-md col-sm ActionColumn">
          <img id="repair" src={repairPath} />
        </div>
        <div className="col-md col-sm ActionColumn">
          <img id="theft" src={theftPath} />
        </div>
        <div className="col-md col-sm ActionColumn">
          <img id="trade" src={tradePath} />
        </div>
        <div className="col-md col-sm ActionColumn">
          <img id="talk" src={talkPath} />
        </div>
      </div>
    </div>
  );
}

export default EnemyCard;
