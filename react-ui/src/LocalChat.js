import React from 'react';

const LocalChat = (props)=>{
  let style = {};

  if(!props.show){
    style={'display':'none'};
  }else{
    style={'display':'contents'};
  }
  return (
    <div className="LocalChat" style={style}>
      <ul id="localChatMessages">
        { props.localChatMessages.map((chatMessage, index)=>{
          return <li key={index}>{chatMessage.message}</li>
        }) }
      </ul>
      <div className="inputBox">
        <input id="m" autoComplete="off" onChange={props.updateLocalChatInputMessage} value={props.localChatInputMessage} onKeyPress={props.handleLocalChatKeyPress} />
        <button style={ { outline:'none' } } onClick={props.submitLocalChatMessage}>Send</button>
      </div>
    </div>
  );
}

export default LocalChat;
