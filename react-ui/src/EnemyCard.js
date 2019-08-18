import React from 'react';
import { Card, CardDeck, ListGroup, ListGroupItem } from 'react-bootstrap';
import './EnemyCard.css';
import crosshairPath from './resources/images/ui/crosshair.png';
import repairPath from './resources/images/ui/repair.png';
import talkPath from './resources/images/ui/talk.png';
import theftPath from './resources/images/ui/theft.png';
import tradePath from './resources/images/ui/trade.png';

const EnemyCard = (props)=>{
  return (
    <div className="EnemyCard">
      <div className="row EnemyImageRow">
        <img src={ require(`${ props.npc.img_url }`) } />
      </div>
      <div className="row EnemyTitleRow">
        <p>{props.npc.npc_name}</p>
        <p>(@doomsayer1)</p>
      </div>
      <div className="row EnemyStatsRow">
        <div className="row StabilityBar">
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
          <img id="attack" src={crosshairPath} />
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
