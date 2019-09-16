import React, { Fragment } from 'react';
import App from './App.js';
import { SnackbarProvider } from 'notistack';

class AppWithSnackbar extends React.Component {

  render(){

    return (
      <SnackbarProvider maxSnack={3} autoHideDuration={5000} anchorOrigin={{vertical:'bottom',horizontal:'right'}}>
        <App history={this.props.history}/>
      </SnackbarProvider>
    );

  }
}

export default AppWithSnackbar;
