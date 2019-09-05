const db = require('./dbcontroller.js');

const initializeTradingWithNpc = (data,socket,nsp,mobsInZone,usersInZone)=>{
  // 1) Check if User has enough currency
  db.pool.query('select currency from players where player_id=$1',[data.playerId],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      if(res.rows[0].currency < data.totalPriceToPay){
        socket.emit('tradeWithNpcResponse',{status:'error',responseMsg:'Not enough currency'});
        return false;
      }else{
        // 2) Take out those items from the NPC
        // 2.1) Find the NPC
        var tradeNpcIndex=null;
        var tradeNpc = mobsInZone.find(function(npc,index){
          if(npc.target_name === data.npcTargetName){
            tradeNpcIndex=index;
            return true;
          }
        });
        // 2.2) Found the NPC, now loop through traded items and apply changes
        for(var i = 0 ; i < data.tradedItems.length ; i++){
          var tradedItemIndex=null;
          var tradedItem = mobsInZone[tradeNpcIndex].npc_items.find(function(item,index){
            if(item.item_id === data.tradedItems[i].item_id){
              //Set the Amount of NPC Item to Previous Amount - Amount wanted by player
              mobsInZone[tradeNpcIndex].npc_items[index].amount = mobsInZone[tradeNpcIndex].npc_items[index].amount - data.tradedItems[i].amount_wanted;
              data.tradedItems[i].total_amount = data.tradedItems[i].total_amount - data.tradedItems[i].amount_wanted;
              return true;
            }
          });
        }

        console.log(data.tradedItems);
        //3) Update player_items with the items , and if Update.rowCount < 1 then Insert. Loop through
        (async ()=>{
          for(var i = 0 ; i < data.tradedItems.length ; i++){
            var amountWanted = data.tradedItems[i].amount_wanted;
            var itemId = data.tradedItems[i].item_id;
            var itemName = data.tradedItems[i].item_name;
            var playerId = data.playerId;
            console.log('itemId->'+itemId);
            console.log('itemName->'+itemName);
            console.log('amount wanted->'+amountWanted);
            if(amountWanted===0){
              continue;
            }
            const updateResult = await db.pool.query('update player_items set amount=amount+$1 where player_id=$2 and item_id=$3',[amountWanted,playerId,itemId]);
            console.log(updateResult);
            if(updateResult.rowCount < 1){
              const insertResult = await db.pool.query('INSERT INTO player_items VALUES($1,$2,$3)',[playerId,itemId,amountWanted]);
              console.log(insertResult);
            }
          }
          //Clean traded items to be sent back
          for(var i = 0 ; i < data.tradedItems.length ; i++){
            data.tradedItems[i].amount_wanted = 0;
            data.tradedItems[i].total_price = 0;
          }

          //4) Update player currency and send success Message! Finally!
          const playerCurrencyUpdateResult = await db.pool.query('update players set currency=currency-$1 where player_id=$2',[data.totalPriceToPay,data.playerId]);
          //Finally here!...
          console.log(data.npcTargetName);
          socket.emit('tradeWithNpcResponse',{status:'success',responseMsg:'Operation Successful'});
          nsp.emit('tradeWithNpc',{data:data});
          nsp.emit('generateZoneNpc',mobsInZone);
          db.getPlayerInfoAndEmit(socket);
          db.getPlayerItemsAndEmit(socket);
          db.getUsersInZoneInfoAndEmit(nsp,usersInZone);
          console.log(playerCurrencyUpdateResult);
        })().catch(err=>{
          console.log(err);
          socket.emit('tradeWithNpcResponse',{status:'error',responseMsg:'There was an error'});
        });

      }
    }
  })
}

module.exports = {
  initializeTradingWithNpc:initializeTradingWithNpc
}
