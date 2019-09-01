import React from 'react';
import './EnemyCard.css';
import HtmlTooltip from './HtmlTooltip';
import crosshairPath from './resources/images/ui/crosshair.png';
import repairPath from './resources/images/ui/repair.png';
import talkPath from './resources/images/ui/talk.png';
import theftPath from './resources/images/ui/theft.png';
import tradePath from './resources/images/ui/trade.png';

const prepareItemsForTrading = (items,targetName,npcId)=>{
  var itemsToBeTraded = [];
  var zeroCount = 0;
  for(var i = 0 ; i < items.length ; i++){
    var itemToBeTraded = {
      item_id:items[i].item_id,
      item_name:items[i].item_name,
      npc_id:npcId,
      npc_target_name:targetName,
      item_cost:items[i].item_cost,
      amount_wanted:0,
      total_amount:items[i].amount,
      total_price:0
    }
    if(itemToBeTraded.total_amount===0){
      zeroCount++;
    }
    itemsToBeTraded.push(itemToBeTraded);
  }
  if(zeroCount === itemsToBeTraded.length){
    return false;
  }else{
    return itemsToBeTraded;
  }
}

const EnemyCard = (props)=>{

    var percentage = (props.npc.current_stability * 100) / props.npc.stability ;
    var style = {};

    var backgroundStyle = props.npc.attacking_user === props.username ? {'box-shadow':'red 0px 0px 0px 3px'} : {} ;

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

    const items = props.npc.npc_items;

    return (
      <div className="EnemyCard" style={backgroundStyle}>
        <div className="row EnemyImageRow">
          <img src={ require(`${ props.npc.img_url }`) } />
        </div>
        <div className="row EnemyTitleRow">
          <HtmlTooltip
           title={
             <React.Fragment>
               {props.npc.npc_text}
             </React.Fragment>
           }
           placement="top"
         >
           <p id="npcName">{props.npc.npc_name}</p>
         </HtmlTooltip>
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
              <HtmlTooltip
               title={
                 <React.Fragment>
                   {'Attack'}
                 </React.Fragment>
               }
               placement="top"
             >
               <img id="attack" src={crosshairPath} onClick={()=>{props.attackNpc(props.npc.target_name)}} />
             </HtmlTooltip>
          </div>
          <div className="col-md col-sm ActionColumn">
            <HtmlTooltip
             title={
               <React.Fragment>
                 {'Repair'}
               </React.Fragment>
             }
             placement="top"
           >
             <img id="repair" src={repairPath} onClick={()=>{props.repairNpc(props.npc.target_name)}} />
           </HtmlTooltip>
          </div>
          <div className="col-md col-sm ActionColumn">
            <HtmlTooltip
             title={
               <React.Fragment>
                 {'Steal'}
               </React.Fragment>
             }
             placement="top"
           >
             <img id="theft" src={theftPath} onClick={()=>{props.stealFromNpc(props.npc.target_name)}} />
           </HtmlTooltip>
          </div>
          <div className="col-md col-sm ActionColumn">
            <HtmlTooltip
             title={
               <React.Fragment>
                 {'Trade'}
               </React.Fragment>
             }
             placement="top"
           >
             <img id="trade" src={tradePath} onClick={()=>{props.handleOpenTradeWithNpcModal(prepareItemsForTrading(items,props.npc.target_name,props.npc.npc_id))}}/>
           </HtmlTooltip>
          </div>
          <div className="col-md col-sm ActionColumn">
            <HtmlTooltip
             title={
               <React.Fragment>
                 {'Talk'}
               </React.Fragment>
             }
             placement="top"
           >
             <img id="talk" src={talkPath} onClick={()=>{props.talkToNpc(props.npc.target_name,props.npc.npc_id)}}/>
           </HtmlTooltip>
          </div>
        </div>
      </div>
    );

}



export default EnemyCard;
