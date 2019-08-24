import React from 'react';
import io from 'socket.io-client';
import UserProfile from './UserProfile';
import './Login.css';
import spinnerPath from './resources/images/ui/spinner.gif'

class Login extends React.Component {

  constructor(){
    super();
    this.state = {
      loginUsername:'',
      loginPassword:'',
      signupUsername:'',
      signupPassword:'',
      showLogin:true,
      showSignup:false,
      loginSent:false,
      signupSent:false,
      loginResponse:'',
      signupResponse:''
    }
    this.socket = null;
  }

  componentWillMount(){
    var username = localStorage.getItem('username');
    var userUniqueID = localStorage.getItem('userUniqueID');
    if(username!==null && userUniqueID!==null){
      this.socket = io('ws://192.168.0.14:5000', {transports: ['websocket'],query:'username='+username+'&userUniqueID='+userUniqueID});
      this.socket.on('sessionStatus',(data)=>{
        if(data.sessionStatus==='valid'){
          this.props.history.push('/');
        }else{
          console.log('Invalid session credentials')
          localStorage.clear();
        }
      });
    }else{
      this.socket = io('ws://192.168.0.14:5000', {transports: ['websocket']});
    }
  }

  componentDidMount(){

    const socket = this.socket;

    socket.on('submitLogin',(data)=>{
      console.log(data);
      this.setState({
        loginResponse:data.responseMessage
      });
      if(data.responseStatus==='OK'){
        UserProfile.setName(data.username);
        UserProfile.setUniqueID(data.userUniqueID);
        localStorage.setItem('username',data.username);
        localStorage.setItem('userUniqueID',data.userUniqueID);
        this.props.history.push('/');
      }
    });

    socket.on('submitSignup',(data)=>{
      console.log(data);
      this.setState({
        signupResponse:data.responseMessage
      });
      if(data.responseStatus==='OK'){
        UserProfile.setName(data.username);
        UserProfile.setUniqueID(data.userUniqueID);
        localStorage.setItem('username',data.username);
        localStorage.setItem('userUniqueID',data.userUniqueID);
        this.props.history.push('/');
      }
    });

    document.getElementsByTagName('input')[0].focus();

  }

  handleLoginUsername = (event)=>{
    this.setState({
      loginUsername:event.target.value
    });
  }

  handleLoginPassword = (event)=>{
    this.setState({
      loginPassword:event.target.value
    });
  }

  handleSignupUsername = (event)=>{
    this.setState({
      signupUsername:event.target.value
    });
  }

  handleSignupPassword = (event)=>{
    this.setState({
      signupPassword:event.target.value
    });
  }

  submitLogin = ()=>{
    let username = this.state.loginUsername;
    let password = this.state.loginPassword;
    if(username === '' || password === ''){
      alert('Please fill all fields');
      return;
    }
    this.socket.emit('submitLogin',{username:username,password:password});
    this.setState({
      loginSent:true
    });
  }

  submitSignup = ()=>{
    let username = this.state.signupUsername;
    let password = this.state.signupPassword;
    if(username === '' || password === ''){
      alert('Please fill all fields');
      return;
    }
    this.socket.emit('submitSignup',{username:username,password:password});
    this.setState({
      signupSent:true
    });
  }

  handleLoginKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.submitLogin();
    }
  }

  handleSignupKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.submitSignup();
    }
  }

  render(){

    const selectedStyle = {
      'background':'#00ff0091',
      'color':'white'
    }

    return (
      <div className="Login">
        <video autoPlay muted loop id="myVideo">
          <source src="./resources/video/tropical.mp4" type="video/mp4" />
        </video>
        <div className="LoginBox">
          <div className="row LoginTabsRow">
            <div className="col-md-6 col-sm-6 LoginTab" style={this.state.showLogin ? selectedStyle : {}} onClick={()=>{this.setState({showLogin:true,showSignup:false})}}>
              Login
            </div>
            <div className="col-md-6 col-sm-6 LoginTab" style={this.state.showSignup ? selectedStyle : {}} onClick={()=>{this.setState({showLogin:false,showSignup:true})}}>
              Signup
            </div>
          </div>
          <div className="row LoginInformationRow">
            <div className="LoginInformationContainer" style={this.state.showLogin ? {'display':'flex'} : {'display':'none'}}>
              <p>Username</p>
              <input value={this.state.loginUsername} onChange={this.handleLoginUsername} maxLength={25}/>
              <p>Password</p>
              <input type="password" value={this.state.loginPassword} onChange={this.handleLoginPassword} maxLength={25} onKeyPress={this.handleLoginKeyPress}/>
              <button onClick={this.submitLogin} >Login</button>
              <div className="ResponseBox" style={this.state.loginResponse !== '' && this.state.loginSent ? {'display':'flex'} : {'display':'none'} }>
                {this.state.loginResponse}
              </div>
              <div className="SpinnerBox" style={this.state.loginResponse === '' && this.state.loginSent ? {'display':'flex'} : {'display':'none'} }>
                <img src={spinnerPath} />
              </div>
            </div>
            <div className="SignupInformationContainer" style={this.state.showSignup ? {'display':'flex'} : {'display':'none'}}>
              <p>Username</p>
              <input value={this.state.signupUsername} onChange={this.handleSignupUsername} maxLength={25}/>
              <p>Password</p>
              <input type="password" value={this.state.signupPassword} onChange={this.handleSignupPassword} maxLength={25} onKeyPress={this.handleSignupKeyPress}/>
              <button onClick={this.submitSignup} >Sign up</button>
              <div className="ResponseBox" style={this.state.signupResponse !== '' && this.state.signupSent ? {'display':'flex'} : {'display':'none'} }>
                {this.state.signupResponse}
              </div>
              <div className="SpinnerBox" style={this.state.signupResponse === '' && this.state.signupSent ? {'display':'flex'} : {'display':'none'} }>
                <img src={spinnerPath} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Login;
