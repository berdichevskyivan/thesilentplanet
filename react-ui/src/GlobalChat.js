import React from 'react';

const GlobalChat = (props)=>{
  let style = {};

  if(!props.show){
    style={'display':'none'};
  }else{
    style={'display':'contents'};
  }
  return (
    <div className="GlobalChat" style={style}>
      <ul id="globalChatMessages">
        { props.globalChatMessages.map((chatMessage, index)=>{
          return <li key={index}>{chatMessage.message}</li>
        }) }
      </ul>
      <div className="inputBox">
        <input id="m" autoComplete="off" onChange={props.updateGlobalChatInputMessage} value={props.globalChatInputMessage} onKeyPress={props.handleGlobalChatKeyPress} />
        <button style={ { outline:'none' } } onClick={props.submitGlobalChatMessage}>Send</button>
      </div>
    </div>
  );
}

export default GlobalChat;
