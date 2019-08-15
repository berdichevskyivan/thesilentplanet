import React from 'react';
import io from 'socket.io-client';
import './App.css';

class App extends React.Component {

  constructor(){
    super();
    this.state = {
      inputMessage:'',
      chatMessages: []
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
      alert('Must write something');
      return false;
    }
    this.socket.emit('chat message',this.state.inputMessage);
    this.setState({
      inputMessage:''
    });
  }

  componentDidMount(){
    this.socket = io('ws://localhost:5000', {transports: ['websocket']});
    const socket = this.socket;

    let newChatMessages = this.state.chatMessages;

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
        <div className="ConsoleBox">
          <ul id="messages">
            { chatMessages }
          </ul>
          <div className="inputBox">
            <input id="m" autoComplete="off" onChange={this.updateInputMessage} value={this.state.inputMessage} onKeyPress={this.handleKeyPress} /><button onClick={this.submitChatMessage}>Send</button>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
