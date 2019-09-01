import React from 'react';
import io from 'socket.io-client';
import EnemyCard from './EnemyCard';
import ResourceCard from './ResourceCard';
import PersonalInfo from './PersonalInfo';
import ZoneInfo from './ZoneInfo';
import Console from './Console';
import LocalChat from './LocalChat';
import GlobalChat from './GlobalChat';
import Equipment from './Equipment';
import Items from './Items';
import Resources from './Resources';
import Crafting from './Crafting';
import UserProfile from './UserProfile';
import TradeWithNpcModal from './TradeWithNpcModal';
import BlueprintModal from './BlueprintModal';
import UserContextMenu from './UserContextMenu';
import ItemContextMenu from './ItemContextMenu';
import EquipmentContextMenu from './EquipmentContextMenu';
import HtmlTooltip from './HtmlTooltip';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import connectedPath from './resources/images/ui/connected.png';
import travellingPath from './resources/images/ui/loadingscreen.gif';
import { MenuProvider } from 'react-contexify';

class App extends React.Component {

  constructor(){
    super();
    this.state = {
      playerName:null,
      zoneVideoUrl:null,
      mouseIsOver:false,
      mouseIsOverResourceZone:false,
      playerInfo:null,
      playerEquipment:[],
      playerResources:[],
      playerItems:[],
      playerBlueprints:[],
      usersInZone:[],
      zoneInfo:null,
      consoleInputMessage:'',
      localChatInputMessage:'',
      globalChatInputMessage:'',
      consoleMessages:[],
      localChatMessages:[],
      globalChatMessages:[],
      npcInZone:[],
      resourcesInZone:[],
      otherZones:[],
      showPersonalInfo:true,
      showZoneInfo:false,
      showConsole:true,
      showGlobalChat:false,
      showLocalChat:false,
      showEquipment:true,
      showItems:false,
      showResources:false,
      showCrafting:false,
      showLoading:false,
      showTradeWithNpcModal:false,
      showBlueprintModal:false,
      itemsBeingTraded:[],
      itemBeingCrafted:[],
      tradeSent:false,
      craftSent:false,
      tradeResponse:'',
      craftResponse:'',
      userInContextMenu:'',
      itemInContextMenu:{},
      equipmentInContextMenu:{}
    }
    this.socket = null;
    this.zoneSocket = null;
    this.updateConsoleInputMessage = this.updateConsoleInputMessage.bind(this);
    this.updateLocalChatInputMessage = this.updateLocalChatInputMessage.bind(this);
    this.updateGlobalChatInputMessage = this.updateGlobalChatInputMessage.bind(this);
    this.submitConsoleMessage = this.submitConsoleMessage.bind(this);
    this.submitLocalChatMessage = this.submitLocalChatMessage.bind(this);
    this.submitGlobalChatMessage = this.submitGlobalChatMessage.bind(this);
  }

  updateConsoleInputMessage(event){
    var message = event.target.value;
    this.setState({
      consoleInputMessage:message
    });
  }

  updateLocalChatInputMessage(event){
    var message = event.target.value;
    this.setState({
      localChatInputMessage:message
    });
  }

  updateGlobalChatInputMessage(event){
    var message = event.target.value;
    this.setState({
      globalChatInputMessage:message
    });
  }

  submitConsoleMessage(event){
    event.preventDefault();
    var message = this.state.consoleInputMessage;
    if (message==='') return false;
    if (message==='logout') this.handleLogout();
    if (message==='clear'){
      this.setState({consoleMessages:[],consoleInputMessage:''});
      return false;
    }
    this.socket.emit('consoleMessage','Invalid command: '+message);
    this.setState({
      consoleInputMessage:''
    });
  }

  submitLocalChatMessage(event){
    event.preventDefault();
    var message = this.state.localChatInputMessage;
    if(message===''){
      return false;
    }
    message = '['+this.state.playerName+'] '+this.state.localChatInputMessage;
    this.zoneSocket.emit('localChatMessage',message);
    this.setState({
      localChatInputMessage:''
    });
  }

  submitGlobalChatMessage(event){
    event.preventDefault();
    var message = this.state.globalChatInputMessage;
    if(message===''){
      return false;
    }
    message = '['+this.state.playerName+'] '+this.state.globalChatInputMessage;
    this.socket.emit('globalChatMessage',message);
    this.setState({
      globalChatInputMessage:''
    });
  }

  componentWillMount(){
    this.setState({
      showLoading:true
    });
  }

  componentDidMount(){
    this.callThisFunction();
  }

  callThisFunction = ()=>{
    var username = localStorage.getItem('username');
    var userUniqueID = localStorage.getItem('userUniqueID');
    if(username===null || userUniqueID===null){
      this.props.history.push('/');
    }else{
      this.setState({
        playerName:username
      });
      this.socket = io('ws://'+window.location.hostname, {transports: ['websocket'],query:'username='+username+'&userUniqueID='+userUniqueID});
      this.socket.on('sessionStatus',(data)=>{
        if(data.sessionStatus==='invalid'){
          localStorage.clear();
          this.props.history.push('/');
          this.socket.disconnect();
          if(this.zoneSocket!=null) this.zoneSocket.disconnect();
        }else{
          const socket = this.socket;

          socket.emit('getPlayerInformation');

          socket.on('getPlayerInformation',(data)=>{
            this.setState({
              playerInfo:data,
              zoneVideoUrl:data.zone_video_url
            });

            this.zoneSocket = io('ws://'+window.location.hostname+data.zone_namespace, {transports: ['websocket'],query:'username='+username+'&userUniqueID='+userUniqueID});
            const zoneSocket = this.zoneSocket;

            zoneSocket.on('changeZone',()=>{
              this.socket.disconnect();
              this.zoneSocket.disconnect();
              this.setState({
                showLoading:true,
                localChatMessages:[],
                usersInZone:[],
                npcInZone:[],
                resourcesInZone:[]
              },()=>{
                this.callThisFunction();
              })

            });

            zoneSocket.on('usersInZone',(data)=>{
              this.setState({
                usersInZone:data
              });
            });

            zoneSocket.on('getPlayerResources',(data)=>{
              this.setState({
                playerResources:data
              });
            });

            zoneSocket.on('getPlayerItems',(data)=>{
              this.setState({
                playerItems:data
              });
            });

            zoneSocket.on('getPlayerBlueprints',(data)=>{
              this.setState({
                playerBlueprints:data
              });
            });

            zoneSocket.on('getPlayerEquipment',(data)=>{
              console.log(data);
              this.setState({
                playerEquipment:data
              });
            });

            zoneSocket.on('getPlayerInformation',(data)=>{
              this.setState({
                playerInfo:data
              });
            });

            zoneSocket.on('consoleMessage', (msg)=>{
              let newConsoleMessages = this.state.consoleMessages;
              newConsoleMessages.push({message:msg});

              this.setState({
                consoleMessages:newConsoleMessages
              },()=>{
                var chatDiv = document.getElementById('consoleMessages');
                chatDiv.scrollTop = chatDiv.scrollHeight;
              });
            });

            zoneSocket.on('localChatMessage', (msg)=>{
              let newLocalChatMessages = this.state.localChatMessages;
              newLocalChatMessages.push({message:msg});

              this.setState({
                localChatMessages:newLocalChatMessages
              },()=>{
                var chatDiv = document.getElementById('localChatMessages');
                chatDiv.scrollTop = chatDiv.scrollHeight;
              });
            });

            zoneSocket.on('getZoneInformation',(data)=>{
              this.setState({
                zoneInfo:data
              });
            });

            zoneSocket.on('getOtherZones',(data)=>{
              this.setState({
                otherZones:data
              });
            });

            zoneSocket.on('generateZoneNpc',(data)=>{
              console.log(data);
              console.log('hey im here');
              this.setState({
                npcInZone:data
              });
            });

            zoneSocket.on('generateZoneResources',(data)=>{
              this.setState({
                resourcesInZone:data
              });
            });

            zoneSocket.on('tradeWithNpcResponse',(data)=>{
              console.log(data);
              this.setState({
                tradeSent:false,
                tradeResponse:data.responseMsg
              });
            });

            zoneSocket.on('tradeWithNpc',(data)=>{
              //This arrives to all sockets in zone, so we need to check that the items in other user's modals are the same Target, we can't just change it
              console.log(data);
              var currentItemsBeingTraded = this.state.itemsBeingTraded;
              if(currentItemsBeingTraded.length < 1){
                return false;
              }else{
                var currentItemsTargetNpc = currentItemsBeingTraded[0].npc_target_name;
                var itemsBeingTradedResponseTargetName = data.data.npcTargetName;
                console.log(currentItemsTargetNpc);
                console.log(itemsBeingTradedResponseTargetName);
                if(currentItemsTargetNpc===itemsBeingTradedResponseTargetName){
                  this.setState({
                    itemsBeingTraded:data.data.tradedItems
                  });
                }else{
                  return false;
                }

              }

            });

            zoneSocket.on('craftItem',(data)=>{
              console.log(data);
              this.setState({
                craftSent:false,
                craftResponse:data.responseMessage,
                itemBeingCrafted:data.itemBeingCrafted
              });
            });

            zoneSocket.on('deathSignal',(data)=>{
              console.log('death');
              this.socket.disconnect();
              this.zoneSocket.disconnect();
              let newPlayerInfo = this.state.playerInfo;
              newPlayerInfo.stability = 0;
              this.setState({
                playerInfo:newPlayerInfo
              });
              setTimeout(()=>{
                this.setState({
                  showLoading:true,
                  localChatMessages:[],
                  usersInZone:[],
                  npcInZone:[],
                  resourcesInZone:[],
                  consoleMessages:[],
                  globalChatMessages:[]
                },()=>{
                  this.callThisFunction();
                })
              },7000);
            });

          });

          socket.on('getPlayerEquipment',(data)=>{
            console.log(data);
            this.setState({
              playerEquipment:data
            });
          });

          socket.on('getPlayerResources',(data)=>{
            this.setState({
              playerResources:data
            });
          });

          socket.on('getPlayerItems',(data)=>{
            this.setState({
              playerItems:data
            });
          });

          socket.on('getPlayerBlueprints',(data)=>{
            console.log('here please!!!');
            console.log(data);
            this.setState({
              playerBlueprints:data
            });
          });

          socket.on('consoleMessage', (msg)=>{
            let newConsoleMessages = this.state.consoleMessages;
            newConsoleMessages.push({message:msg});

            this.setState({
              consoleMessages:newConsoleMessages
            },()=>{
              var chatDiv = document.getElementById('consoleMessages');
              chatDiv.scrollTop = chatDiv.scrollHeight;
            });
          });

          socket.on('globalChatMessage', (msg)=>{
            let newGlobalChatMessages = this.state.globalChatMessages;
            newGlobalChatMessages.push({message:msg});

            this.setState({
              globalChatMessages:newGlobalChatMessages
            },()=>{
              var chatDiv = document.getElementById('globalChatMessages');
              chatDiv.scrollTop = chatDiv.scrollHeight;
            });
          });

          socket.on('logout',()=>{
            localStorage.clear();
            this.props.history.push('/');
            this.socket.disconnect();
            this.zoneSocket.disconnect();
          });

          var npcZone = document.getElementsByClassName('NpcZone')[0];
          var resourceZone = document.getElementsByClassName('ResourceZone')[0];

          window.addEventListener('wheel', (e)=>{
            if(this.state.mouseIsOver){
              if (e.deltaY > 0) npcZone.scrollLeft += 50;
              else npcZone.scrollLeft -= 50;
            }
            if(this.state.mouseIsOverResourceZone){
              if (e.deltaY > 0) resourceZone.scrollLeft += 50;
              else resourceZone.scrollLeft -= 50;
            }
          });

          this.checkForVideo();

          document.getElementById('m').focus();
        }

      });
    }
  }

  checkForVideo = ()=>{
    setTimeout(()=>{
      var video = document.getElementById("myVideo");
      if ( video.readyState === 4 ) {
        this.setState({
          showLoading:false
        });
      }else{
        setTimeout(this.checkForVideo,500);
      }
    },500)
  }

  handleConsoleKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.submitConsoleMessage(event);
    }
  }

  handleLocalChatKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.submitLocalChatMessage(event);
    }
  }

  handleGlobalChatKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.submitGlobalChatMessage(event);
    }
  }

  handleChangeZone = (event)=>{
    var zone_id = event.target.value;
    var player_id = this.state.playerInfo.player_id;
    this.zoneSocket.emit('changeZone',{ zone_id:zone_id,player_id:player_id });
  }

  handleLogout = ()=>{
    this.socket.emit('logout',{});
  }

  attackNpc = (targetName)=>{
    this.zoneSocket.emit('attackNpc',{
      attackingUser:this.state.playerInfo.player_name,
      attackedTarget:targetName,
      spDamage:this.state.playerInfo.attack_power
    });
  }

  repairNpc = (targetName)=>{
    this.zoneSocket.emit('repairNpc',{
      repairingUser:this.state.playerInfo.player_name,
      repairedTarget:targetName,
      spRepair:1
    });
  }

  stealFromNpc = (targetName)=>{
    this.zoneSocket.emit('stealFromNpc',{
      stealingUser:this.state.playerInfo.player_name,
      stolenFromTarget:targetName,
      amountStolen:1
    });
  }

  talkToNpc = (targetName,npcId)=>{
    this.zoneSocket.emit('talkToNpc',{
      npcTargetName:targetName,
      npcId:npcId
    });
  }

  collectResource = (targetName,resourceName,resourceId)=>{
    this.zoneSocket.emit('collectResource',{
      collectingUser:this.state.playerInfo.player_name,
      collectingUserId:this.state.playerInfo.player_id,
      collectedResource:targetName,
      collectedResourceName:resourceName,
      collectedResourceId:resourceId
    });
  }

  handleOpenTradeWithNpcModal = (tradedItems)=>{
    if(tradedItems!==false){
      this.setState({
        itemsBeingTraded:tradedItems,
        showTradeWithNpcModal:true
      });
    }else{
      let newConsoleMessages = this.state.consoleMessages;
      newConsoleMessages.push({message:'Target has no items to trade.'});

      this.setState({
        consoleMessages:newConsoleMessages
      },()=>{
        var chatDiv = document.getElementById('consoleMessages');
        chatDiv.scrollTop = chatDiv.scrollHeight;
      });
    }
  }

  handleOpenBlueprintModal = (blueprint)=>{
    let blueprintResources = blueprint.blueprint_resources;
    let playerResources = this.state.playerResources;

    for(let i = 0 ; i < blueprintResources.length ; i++){
      let blueprintResourceId = blueprintResources[i].resource_id;
      if(playerResources.length > 0){
        for(let x = 0 ; x < playerResources.length ; x++){
          let playerResourceId = playerResources[x].resource_id;
          if(blueprintResourceId===playerResourceId){
            blueprintResources[i].amount_in_inventory = playerResources[x].amount;
            break;
          }else{
            blueprintResources[i].amount_in_inventory = 0;
          }
        }
      }else{
        blueprintResources[i].amount_in_inventory = 0;
      }

    }

    this.setState({
      showBlueprintModal:true,
      itemBeingCrafted:blueprintResources
    });
  }

  handleCloseBlueprintModal = ()=>{
    this.setState({
      showBlueprintModal:false
    },()=>{
      setTimeout(()=>{
        this.setState({
          itemBeingCrafted:[],
          craftSent:false,
          craftResponse:''
        });
      },150);
    });
  }

  handleCloseTradeWithNpcModal = ()=>{
    this.setState({
      showTradeWithNpcModal:false
    },()=>{
      setTimeout(()=>{
        this.setState({
          tradeSent:false,
          tradeResponse:'',
          itemsBeingTraded:[]
        });
      },150);
    });
  }

  handleChangeAmountWanted = (event,itemId)=>{
    var reg = new RegExp('^[0-9]+$');
    var value = event.target.value;
    if(value.match(reg)===null && value!==''){
      return false;
    }
    var newItemsBeingTraded = this.state.itemsBeingTraded;
    for(var i = 0 ; i < newItemsBeingTraded.length ; i++){
      if(newItemsBeingTraded[i].item_id===itemId){
        if(value > newItemsBeingTraded[i].total_amount){
          return false;
        }
        newItemsBeingTraded[i].amount_wanted = +value;
        newItemsBeingTraded[i].total_price = value * newItemsBeingTraded[i].item_cost;
      }
    }
    this.setState({
      itemsBeingTraded:newItemsBeingTraded
    });
  }

  buyTradedItems = ()=>{
    var tradedItems = this.state.itemsBeingTraded;
    var tradedItemsToBeSent = [];
    var totalPriceToPay = 0;
    var npcTargetName = '';
    var zeroCount = 0;
    for(var i = 0 ; i < tradedItems.length ; i++){
        if(tradedItems[i].amount_wanted===0){
          console.log(tradedItems[i].amount_wanted);
          zeroCount++
        }
        totalPriceToPay = totalPriceToPay + tradedItems[i].total_price;
        npcTargetName = tradedItems[i].npc_target_name;
        tradedItemsToBeSent.push(tradedItems[i]);
    }
    if(zeroCount === tradedItems.length){
      this.setState({
        tradeResponse:'Haven\'t bought anything'
      });
      return false;
    }
    this.zoneSocket.emit('tradeWithNpc',{
      playerId:this.state.playerInfo.player_id,
      npcTargetName:npcTargetName,
      totalPriceToPay:totalPriceToPay,
      tradedItems:tradedItemsToBeSent
    });
    this.setState({
      tradeSent:true
    });
  }

  handleShowUserContextMenu = (e)=>{
    console.log('showing user context');
  }

  handleHideUserContextMenu = (e)=>{
    console.log('hiding user context');
  }

  setItemInContextMenu = (item)=>{
    this.setState({
      itemInContextMenu:item
    });
  }

  setEquipmentInContextMenu = (equipmentSlot)=>{
    this.setState({
      equipmentInContextMenu:equipmentSlot
    });
  }

  useItem = (item)=>{
    if(item.item_effect_type==='blueprint'){
      let blueprints = this.state.playerBlueprints;
      let found = false;
      for(let i = 0 ; i < blueprints.length ; i++){
        if(blueprints[i].blueprint_id===item.item_id){
          found = true;
        }
      }
      if(found){
        this.socket.emit('consoleMessage','You have already downloaded this blueprint.');
      }else{
        this.zoneSocket.emit('useItem',item);
      }
    }else if(item.item_effect_type==='coordinates'){
      let otherZones = this.state.otherZones;
      let found = false;
      for(let i = 0 ; i < otherZones.length ; i++){
        if(parseInt(otherZones[i].zone_id)===parseInt(item.item_effect_impact)){
          found = true;
        }
      }
      if(found){
        this.socket.emit('consoleMessage','You have already downloaded these coordinates.');
      }else{
        this.zoneSocket.emit('useItem',item);
      }
    }else{
      this.zoneSocket.emit('useItem',item);
    }
  }

  equipItem = (item)=>{
    let playerEquipment = this.state.playerEquipment;
    let itemAlreadyEquipped = false;
    for(let i = 0 ; i < playerEquipment.length ; i++){
      if(item.item_id === playerEquipment[i].item_id){
        itemAlreadyEquipped = true;
      }
    }
    if(itemAlreadyEquipped){
      this.socket.emit('consoleMessage','Item is already equipped.');
    }else{
      this.zoneSocket.emit('equipItem',item);
    }
  }

  unequipItem = (equipment)=>{
    this.zoneSocket.emit('unequipItem',equipment);
  }

  craftItem = (item)=>{
    for(let i = 0 ; i < item.length ; i++){
      if(item[i].amount_in_inventory < item[i].amount){
        this.setState({
          craftResponse:'You don\'t have enough resources'
        });
        return false;
      }
    }
    this.zoneSocket.emit('craftItem',{
      playerId:this.state.playerInfo.player_id,
      itemBeingCrafted:item
    });
    this.setState({
      craftSent:true
    });
  }

  render(){

    const rowOrColumn = this.state.npcInZone.length > 3 ? {'flex-flow':'column', 'flex-wrap':'wrap'} : {'flex-flow':'row','flex-wrap':'nowrap'} ;
    const rowOrColumnForResource = this.state.resourcesInZone.length > 3 ? {'flex-flow':'column', 'flex-wrap':'wrap'} : {'flex-flow':'row','flex-wrap':'nowrap'} ;

    return (
      <div className="App" onContextMenu={(e)=>{}}>
        <TradeWithNpcModal showTradeWithNpcModal={this.state.showTradeWithNpcModal} handleCloseTradeWithNpcModal={this.handleCloseTradeWithNpcModal} itemsBeingTraded={this.state.itemsBeingTraded}
          handleChangeAmountWanted={this.handleChangeAmountWanted} buyTradedItems={this.buyTradedItems} tradeSent={this.state.tradeSent} tradeResponse={this.state.tradeResponse}/>
        <BlueprintModal showBlueprintModal={this.state.showBlueprintModal} handleCloseBlueprintModal={this.handleCloseBlueprintModal} itemBeingCrafted={this.state.itemBeingCrafted} craftItem={this.craftItem}
        craftSent={this.state.craftSent} craftResponse={this.state.craftResponse} />
        <div className="Travelling" style={this.state.showLoading?{'display':'flex'}:{'display':'none'}}>
          <img src={travellingPath} />
        </div>
        <div className="container-fluid">
          <video autoPlay muted loop id="myVideo" key={this.state.zoneVideoUrl}>
            <source src={this.state.zoneVideoUrl} type="video/mp4" />
          </video>
          <div className="row WorldView fixed-top">
            <div className="col-md-2 col-sm-2 worldcolumn hideonmobile">
              <div className="row WorldViewTabs">
                <div className="col-md-12 col-sm-12 worldviewtab">
                  <p>Players Currently in Zone</p>
                </div>
              </div>
              <div className="row CurrentPlayers">
                <ul>
                  { this.state.usersInZone.map((user)=>{
                    return <MenuProvider id="menu_id" style={{'display':'contents'} } onContextMenu={()=>{this.setState({userInContextMenu:user.username})}} >
                      <li><img src={connectedPath} />{user.username}</li>
                    </MenuProvider>
                  }) }
                </ul>
              </div>
            </div>
            <div className="col-md-8 col-sm-8 worldcolumn">
              <div className="row ResourceZone" style={rowOrColumnForResource} onMouseOver={ ()=>{this.setState({mouseIsOverResourceZone:true})}} onMouseOut={()=>{this.setState({mouseIsOverResourceZone:false})}}>
                { this.state.resourcesInZone.map((resource)=>{
                  return <ResourceCard resource={resource} collectResource={this.collectResource} />
                }) }
              </div>
              <div className="row NpcZone" style={rowOrColumn} onMouseOver={ ()=>{this.setState({mouseIsOver:true})}} onMouseOut={()=>{this.setState({mouseIsOver:false})}} >
                { this.state.npcInZone.map((npc)=>{
                  return <EnemyCard npc={npc} attackNpc={this.attackNpc} repairNpc={this.repairNpc}
                  stealFromNpc={this.stealFromNpc} talkToNpc={this.talkToNpc}
                  handleOpenTradeWithNpcModal={this.handleOpenTradeWithNpcModal} username={this.state.playerInfo.player_name}/>
                }) }
              </div>
            </div>
            <div className="col-md-2 col-sm-2 worldcolumn hideonmobile">
              <div className="row WorldViewTabs">
                <div className="col-md-12 col-sm-12 worldviewtab">
                  <p>Available Zones</p>
                </div>
              </div>
              <div className="row OtherZones">
                <ul>
                  { this.state.otherZones.map((zone)=>{
                    if(zone.zone_id===this.state.playerInfo.current_zone_id){
                      return (<HtmlTooltip
                                 title={
                                   <React.Fragment>
                                     {zone.zone_text}
                                   </React.Fragment>
                                 }
                                 placement="left">
                                 <li style={{'background':'#00ff00bf','color':'white'}} value={zone.zone_id} onClick={this.handleChangeZone}>{zone.zone_name}</li>
                               </HtmlTooltip> );

                    }else{
                      return (<HtmlTooltip
                                 title={
                                   <React.Fragment>
                                     {zone.zone_text}
                                   </React.Fragment>
                                 }
                                 placement="left">
                                 <li value={zone.zone_id} onClick={this.handleChangeZone}>{zone.zone_name}</li>
                               </HtmlTooltip> );
                    }
                  }) }
                </ul>
              </div>
            </div>
          </div>
          <div className="row Footer fixed-bottom">
            <div className="col-md-4 col-sm-4 column InfoBox hideonmobile">
              <div className="row Tabs">
                <div className="col-md-6 col-sm-6 tabcolumn" style={this.state.showPersonalInfo ? { 'background':'#00ff0091', 'color':'white'} : {} } onClick={()=>{this.setState({ showPersonalInfo:true, showZoneInfo:false })}}>
                  <p>Personal Information</p>
                </div>
                <div className="col-md-6 col-sm-6 tabcolumn" style={this.state.showZoneInfo ? { 'background':'#00ff0091', 'color':'white'} : {} } onClick={()=>{this.setState({ showPersonalInfo:false, showZoneInfo:true })}}>
                  <p>Zone Information</p>
                </div>
              </div>
              <div className="row InformationBox">
                {this.state.playerInfo===null ? null : <PersonalInfo player={this.state.playerInfo} show={this.state.showPersonalInfo}/>}
                {this.state.zoneInfo===null ? null : <ZoneInfo zone={this.state.zoneInfo} show={this.state.showZoneInfo}/>}
              </div>
            </div>
            <div className="col-md-4 col-sm-4 column">
              <div className="ConsoleBox">
                <Console show={this.state.showConsole} consoleMessages={this.state.consoleMessages} updateConsoleInputMessage={this.updateConsoleInputMessage}
                         consoleInputMessage={this.state.consoleInputMessage} handleConsoleKeyPress={this.handleConsoleKeyPress} submitConsoleMessage={this.submitConsoleMessage} />
                <LocalChat show={this.state.showLocalChat} localChatMessages={this.state.localChatMessages} updateLocalChatInputMessage={this.updateLocalChatInputMessage}
                           localChatInputMessage={this.state.localChatInputMessage} handleLocalChatKeyPress={this.handleLocalChatKeyPress} submitLocalChatMessage={this.submitLocalChatMessage}/>
                <GlobalChat show={this.state.showGlobalChat} globalChatMessages={this.state.globalChatMessages} updateGlobalChatInputMessage={this.updateGlobalChatInputMessage}
                            globalChatInputMessage={this.state.globalChatInputMessage} handleGlobalChatKeyPress={this.handleGlobalChatKeyPress} submitGlobalChatMessage={this.submitGlobalChatMessage}/>
                <div className="row Tabs">
                  <div className="col-md-4 col-sm-4 tabcolumn equipmentTab" style={this.state.showLocalChat ? { 'background':'#00ff0091', 'color':'white'} : {} }
                                                                            onClick={()=>{this.setState({ showConsole:false, showLocalChat:true, showGlobalChat:false })}}>
                    <p>Local Chat</p>
                  </div>
                  <div className="col-md-4 col-sm-4 tabcolumn" style={this.state.showConsole ? { 'background':'#00ff0091', 'color':'white'} : {} } onClick={()=>{this.setState({ showConsole:true, showLocalChat:false, showGlobalChat:false })}}>
                    <p>Console</p>
                  </div>
                  <div className="col-md-4 col-sm-4 tabcolumn" style={this.state.showGlobalChat ? { 'background':'#00ff0091', 'color':'white'} : {} } onClick={()=>{this.setState({ showConsole:false, showLocalChat:false, showGlobalChat:true })}}>
                    <p>Global Chat</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-4 column hideonmobile">
              <div className="row Tabs">
                <div className="col-md-3 col-sm-3 tabcolumn equipmentTab" style={this.state.showEquipment ? { 'background':'#00ff0091', 'color':'white'} : {} } onClick={()=>{this.setState({ showEquipment:true, showItems:false, showResources:false, showCrafting:false })}}>
                  <p>Equipment</p>
                </div>
                <div className="col-md-3 col-sm-3 tabcolumn" style={this.state.showItems ? { 'background':'#00ff0091', 'color':'white'} : {} } onClick={()=>{this.setState({ showEquipment:false, showItems:true, showResources:false, showCrafting:false })}}>
                  <p>Items</p>
                </div>
                <div className="col-md-3 col-sm-3 tabcolumn" style={this.state.showResources ? { 'background':'#00ff0091', 'color':'white'} : {} } onClick={()=>{this.setState({ showEquipment:false, showItems:false, showResources:true, showCrafting:false })}}>
                  <p>Resources</p>
                </div>
                <div className="col-md-3 col-sm-3 tabcolumn" style={this.state.showCrafting ? { 'background':'#00ff0091', 'color':'white'} : {} } onClick={()=>{this.setState({ showEquipment:false, showItems:false, showResources:false, showCrafting:true })}}>
                  <p>Crafting</p>
                </div>
              </div>
              <Equipment show={this.state.showEquipment} playerEquipment={this.state.playerEquipment} setEquipmentInContextMenu={this.setEquipmentInContextMenu} />
              <Items show={this.state.showItems} playerItems={this.state.playerItems} setItemInContextMenu={this.setItemInContextMenu} />
              <Resources show={this.state.showResources} playerResources={this.state.playerResources} />
              <Crafting show={this.state.showCrafting} playerBlueprints={this.state.playerBlueprints} handleOpenBlueprintModal={this.handleOpenBlueprintModal}/>
            </div>
          </div>
        </div>
        <UserContextMenu username={this.state.userInContextMenu} handleShowUserContextMenu={this.handleShowUserContextMenu} handleHideUserContextMenu={this.handleHideUserContextMenu} />
        <ItemContextMenu item={this.state.itemInContextMenu} useItem={this.useItem} equipItem={this.equipItem}/>
        <EquipmentContextMenu equipment={this.state.equipmentInContextMenu} unequipItem={this.unequipItem}/>
      </div>
    );
  }

}

export default App;
