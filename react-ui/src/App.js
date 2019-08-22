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
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import videoPath from './resources/video/forest.mp4';

class App extends React.Component {

  constructor(){
    super();
    this.state = {
      playerName:'akitsushima',
      mouseIsOver:false,
      mouseIsOverResourceZone:false,
      playerInfo:null,
      playerEquipment:[],
      playerResources:[],
      playerItems:[],
      zoneInfo:null,
      consoleInputMessage:'',
      localChatInputMessage:'',
      globalChatInputMessage:'',
      consoleMessages:[],
      localChatMessages:[],
      globalChatMessages:[],
      npcInZone:[],
      resourcesInZone:[],
      showPersonalInfo:true,
      showZoneInfo:false,
      showConsole:true,
      showGlobalChat:false,
      showLocalChat:false,
      showEquipment:true,
      showItems:false,
      showResources:false
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
    if(message===''){
      return false;
    }
    this.socket.emit('consoleMessage',message);
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
    this.socket.emit('localChatMessage',message);
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

  componentDidMount(){

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

    this.socket = io('ws://192.168.0.14:5000', {transports: ['websocket'],query:'username='+this.state.playerName});
    this.zoneSocket = io('ws://192.168.0.14:5000/first-zone-namespace', {transports: ['websocket'],query:'username='+this.state.playerName});
    const socket = this.socket;
    const zoneSocket = this.zoneSocket;

    socket.emit('getPlayerInformation',{player_id:1});

    socket.on('getPlayerInformation',(data)=>{
      this.setState({
        playerInfo:data
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

    zoneSocket.on('getZoneInformation',(data)=>{
      this.setState({
        zoneInfo:data
      });
    });

    zoneSocket.on('generateZoneNpc',(data)=>{
      this.setState({
        npcInZone:data
      });
    });

    zoneSocket.on('generateZoneResources',(data)=>{
      this.setState({
        resourcesInZone:data
      });
    });

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

  attackNpc = (targetName)=>{
    this.zoneSocket.emit('attackNpc',{
      attackingUser:this.state.playerInfo.player_name,
      attackedTarget:targetName,
      spDamage:1
    });
  }

  render(){

    const rowOrColumn = this.state.npcInZone.length > 3 ? {'flex-flow':'column', 'flex-wrap':'wrap'} : {'flex-flow':'row','flex-wrap':'nowrap'} ;
    const rowOrColumnForResource = this.state.resourcesInZone.length > 3 ? {'flex-flow':'column', 'flex-wrap':'wrap'} : {'flex-flow':'row','flex-wrap':'nowrap'} ;

    return (
      <div className="App">

        <div className="container-fluid">
          <video autoPlay muted loop id="myVideo">
            <source src={videoPath} type="video/mp4" />
          </video>
          <div className="row WorldView fixed-top">
            <div className="col-md-2 col-sm-2 worldcolumn hideonmobile">
              <div className="row WorldViewTabs">
                <div className="col-md-12 col-sm-12 worldviewtab">
                  <p>Players Currently in Zone</p>
                </div>
              </div>
              <div className="row CurrentPlayers">
              </div>
            </div>
            <div className="col-md-8 col-sm-8 worldcolumn">
              <div className="row ResourceZone" style={rowOrColumnForResource} onMouseOver={ ()=>{this.setState({mouseIsOverResourceZone:true})}} onMouseOut={()=>{this.setState({mouseIsOverResourceZone:false})}}>
                { this.state.resourcesInZone.map((resource)=>{
                  return <ResourceCard resource={resource} />
                }) }
              </div>
              <div className="row NpcZone" style={rowOrColumn} onMouseOver={ ()=>{this.setState({mouseIsOver:true})}} onMouseOut={()=>{this.setState({mouseIsOver:false})}} >
                { this.state.npcInZone.map((npc)=>{
                  return <EnemyCard npc={npc} attackNpc={this.attackNpc} />
                }) }
              </div>
            </div>
            <div className="col-md-2 col-sm-2 worldcolumn hideonmobile">
              <div className="row WorldViewTabs">
                <div className="col-md-12 col-sm-12 worldviewtab">
                  <p>Other Zones</p>
                </div>
              </div>
              <div className="row OtherZones">
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
                <div className="col-md-4 col-sm-4 tabcolumn equipmentTab" style={this.state.showEquipment ? { 'background':'#00ff0091', 'color':'white'} : {} } onClick={()=>{this.setState({ showEquipment:true, showItems:false, showResources:false })}}>
                  <p>Equipment</p>
                </div>
                <div className="col-md-4 col-sm-4 tabcolumn" style={this.state.showItems ? { 'background':'#00ff0091', 'color':'white'} : {} } onClick={()=>{this.setState({ showEquipment:false, showItems:true, showResources:false })}}>
                  <p>Items</p>
                </div>
                <div className="col-md-4 col-sm-4 tabcolumn" style={this.state.showResources ? { 'background':'#00ff0091', 'color':'white'} : {} } onClick={()=>{this.setState({ showEquipment:false, showItems:false, showResources:true })}}>
                  <p>Resources</p>
                </div>
              </div>
              <Equipment show={this.state.showEquipment} playerEquipment={this.state.playerEquipment} />
              <Items show={this.state.showItems} playerItems={this.state.playerItems} />
              <Resources show={this.state.showResources} playerResources={this.state.playerResources} />
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
