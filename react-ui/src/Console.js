import React from 'react';

const Console = (props)=>{
  let style = {};

  if(!props.show){
    style={'display':'none'};
  }else{
    style={'display':'contents'};
  }

  return (
    <div className="Console" style={style}>
      <ul id="consoleMessages">
        { props.consoleMessages.map((chatMessage, index)=>{
          return <li key={index}>{chatMessage.message}</li>
        }) }
      </ul>
      <div className="inputBox">
        <input id="consoleInput" autoComplete="off" onChange={props.updateConsoleInputMessage} value={props.consoleInputMessage} onKeyPress={props.handleConsoleKeyPress} />
      </div>
    </div>
  );
}

export default Console;
