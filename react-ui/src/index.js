import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch, IndexRoute } from 'react-router-dom';
import App from './App';
import AppWithSnackbar from './AppWithSnackbar';
import Login from './Login';
import NotFound from './NotFound';
import * as serviceWorker from './serviceWorker';

const routing = (
  <Router>
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route path="/world" component={ AppWithSnackbar } />
      <Route component={ NotFound } />
    </Switch>
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
