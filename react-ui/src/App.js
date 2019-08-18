import React from 'react';
import io from 'socket.io-client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import videoPath from './resources/video/tropical.mp4';

class App extends React.Component {

  constructor(){
    super();
    this.state = {
      playerInfo:null,
      playerResources:[],
      playerItems:[],
      inputMessage:'',
      chatMessages:[]
    }
    this.socket = null;
    this.updateInputMessage = this.updateInputMessage.bind(this);
    this.submitChatMessage = this.submitChatMessage.bind(this);
  }

  updateInputMessage(event){
    var message = event.target.value;
    this.setState({
      inputMessage:message
    });
  }

  submitChatMessage(event){
    event.preventDefault();
    var message = this.state.inputMessage;
    if(message===''){
      return false;
    }
    this.socket.emit('chat message',this.state.inputMessage);
    this.setState({
      inputMessage:''
    });
  }

  componentDidMount(){
    this.socket = io('ws://192.168.0.14:5000', {transports: ['websocket']});
    const socket = this.socket;

    let newChatMessages = this.state.chatMessages;

    socket.emit('getPlayerInformation',{player_id:1});

    socket.on('getPlayerInformation',function(data){
      console.log(data);
    });

    socket.on('getPlayerResources',function(data){
      console.log(data)
    });

    socket.on('getPlayerItems',function(data){
      console.log(data);
    });

    socket.on('getZoneInformation',function(data){
      console.log(data);
    });

    socket.on('getZoneNPC',function(data){
      console.log(data);
    });

    socket.on('getZoneResources',function(data){
      console.log(data);
    });

    socket.on('chat message', (msg)=>{

      newChatMessages.push({message:msg});

      this.setState({
        chatMessages:newChatMessages
      },()=>{
        var chatDiv = document.getElementById('messages');
        chatDiv.scrollTop = chatDiv.scrollHeight;
      });
    });
  }

  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.submitChatMessage(event);
    }
  }

  render(){

    const chatMessages = this.state.chatMessages.map((chatMessage, index)=>{
      return <li key={index}>{chatMessage.message}</li>
    });

    return (
      <div className="App">

        <div className="container-fluid">
          <video autoPlay muted loop id="myVideo">
            <source src={videoPath} type="video/mp4" />
          </video>
          <div className="row WorldView fixed-top">
            <div className="col-md-2 col-sm-2 worldcolumn">
              <div className="row WorldViewTabs">
                <div className="col-md-12 col-sm-12 worldviewtab">
                  <p>Players Currently in Zone</p>
                </div>
              </div>
              <div className="row CurrentPlayers">
              </div>
            </div>
            <div className="col-md-8 col-sm-8 worldcolumn">
              <div className="row ResourceZone">
              </div>
              <div className="row NpcZone">
              </div>
            </div>
            <div className="col-md-2 col-sm-2 worldcolumn">
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
            <div className="col-md-4 col-sm-4 column InfoBox">
              <div className="row Tabs">
                <div className="col-md-6 col-sm-6 tabcolumn">
                  <p>Personal Information</p>
                </div>
                <div className="col-md-6 col-sm-6 tabcolumn">
                  <p>Zone Information</p>
                </div>
              </div>
              <div className="row InformationBox">
              </div>
            </div>
            <div className="col-md-4 col-sm-4 column">
              <div className="ConsoleBox">
                <ul id="messages">
                  { chatMessages }
                </ul>
                <div className="inputBox">
                  <input id="m" autoComplete="off" onChange={this.updateInputMessage} value={this.state.inputMessage} onKeyPress={this.handleKeyPress} />
                  <button style={ { outline:'none' } } onClick={this.submitChatMessage}>Send</button>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-4 column">
              <div className="row Tabs">
                <div className="col-md-4 col-sm-4 tabcolumn equipmentTab">
                  <p>Equipment</p>
                </div>
                <div className="col-md-4 col-sm-4 tabcolumn">
                  <p>Items</p>
                </div>
                <div className="col-md-4 col-sm-4 tabcolumn">
                  <p>Resources</p>
                </div>
              </div>
              <div className="row InformationBox">
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
