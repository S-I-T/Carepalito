import React, { Component } from 'react';
import iconMic from './images/mic.png'
import iconMusic from './images/music.png'
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.ws = null;
    this.timeoutSpeak = null;
    this.state = {faceClass:"face",
                  info:"",
                  showMic:false,
                  micTextParcial:"",
                  showMusic:false,
                  musicName:"",
                  showMouthSpeaking:false,
                  mouthSpeakingWidth:250,
                  pupilTop:50,
                  pupilLeft:50,
                  hideLeftLid:true,
                  hideRightLid:true}

    this.onEyeTouchStart = this.onEyeTouchStart.bind(this)
    this.onEyeTouchEnd   = this.onEyeTouchEnd.bind(this)
  }

  componentDidMount(){
    this.blink()
    this.initWebsocket()
  }

  componentWillUnmount(){
    this.finishWebsocket()
  }

  initWebsocket(){
    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.onerror = () => console.log('WebSocket error');
    this.ws.onopen = () => console.log('WebSocket connection established');
    this.ws.onclose = () => console.log('WebSocket connection closed');
    this.ws.onmessage = (e) => {
      var event = JSON.parse(e.data)

      switch(event.accion){
        case "escuchando":{
          if(event.estado){
              this.setState({showMic:event.estado,micTextParcial:"",showMusic:false})
          }
          else{
            if(event.texto){
              this.setState({micTextParcial:event.texto})
              setTimeout(()=>{
                this.setState({showMic:false})
              },2000)
            }
          }

          break;
        }
        case "escuchandoParcial":{
          this.setState({micTextParcial:event.texto})
          break;
        }
        case "cantando":{
          this.setState({showMusic:event.estado,musicName:"Reproduciendo '"+event.nombre+"'"})
          break;
        }
        case "hablando":{
          this.setState({showMouthSpeaking:event.estado})
          if(event.estado){
              this.speak();
          }
          else{
            if(this.timeoutSpeak){
                clearTimeout(this.timeoutSpeak)
            }
          }
          break;
        }
        case "cambioCara":{
          this.setState({faceClass:event.cara})
          break
        }
        default:{
          console.warn("Accion no definida: "+event.accion)
        }
      }
    }
  }

  finishWebsocket(){
    if(this.ws){
        this.ws.close()
    }
  }

  blink(){
    var blinkConfig = {
        delay: function() {
            return Math.random() * 5000 + 1000;
        },
        duration: function() {
            return 300 + Math.floor(Math.random() * 100);
        }
    }

    this.setState({hideLeftLid:false,hideRightLid:false})
    setTimeout(()=>{
        this.setState({hideLeftLid:!this.state.leftEyeTouching,hideRightLid:!this.state.rightEyeTouching})
        setTimeout(this.blink.bind(this),blinkConfig.delay())
    },blinkConfig.duration())
  }

  speak(){
    this.setState({mouthSpeakingWidth:250 - Math.floor(Math.random() * 200)})
    this.timeoutSpeak = setTimeout(this.speak.bind(this),100 + Math.floor(Math.random() * 100));
  }

  render() {
    var hideLid    = {display:"none"}
    var pupilStyle = {top: this.state.pupilTop+"%",
                  left: this.state.pupilLeft+"%"}
    return (
        <div className={this.state.faceClass}>
            <div className="lid left" style={this.state.hideLeftLid ? hideLid : null}></div>
            <div className="eye left" style={this.state.hideLeftLid ? null : hideLid} data-eye="left"  onMouseEnter={this.onEyeTouchStart} onMouseExit={this.onEyeTouchEnd} onTouchStart={this.onEyeTouchStart} onTouchCancel={this.onEyeTouchEnd} onTouchEnd={this.onEyeTouchEnd} >
                <div className="pupil" style={pupilStyle}></div>
            </div>

            <div className="lid right" style={this.state.hideRightLid ? hideLid : null} ></div>
            <div className="eye right" style={this.state.hideRightLid ? null : hideLid} data-eye="right" onMouseEnter={this.onEyeTouchStart} onMouseExit={this.onEyeTouchEnd} onTouchStart={this.onEyeTouchStart} onTouchCancel={this.onEyeTouchEnd} onTouchEnd={this.onEyeTouchEnd}>
                <div className="pupil" style={pupilStyle}></div>
            </div>
            {this.state.showMouthSpeaking?
              <div className="mouthSpeaking" style={{width:this.state.mouthSpeakingWidth+"px",marginLeft:(-1*this.state.mouthSpeakingWidth/2)+"px"}}></div>
              :
              <div className="mouth" onTouchStart={this.onMouthTouchStart} onClick={this.onMouthTouchStart}></div>
            }

            {this.state.showMic?
              <div className="mic">
                <img src={iconMic} alt="icono microfono" />
                {this.state.micTextParcial}
              </div>
              :null}

            {this.state.showMusic?
              <div className="music">
                <img src={iconMusic} alt="icono microfono" />
                {this.state.musicName}
              </div>
              :null}
        </div>
    );
  }

  onEyeTouchStart(e){
    console.log("Start touching eye "+e.target.getAttribute('data-eye'))
    if(e.target.getAttribute('data-eye')==="right"){
        this.setState({hideRightLid:false,rightEyeTouching:true})
    }
    else{
        this.setState({hideLeftLid:false,leftEyeTouching:true})
    }
  }

  onEyeTouchEnd(e){
    console.log("End touching eye "+e.target.getAttribute('data-eye'))

    if(e.target.getAttribute('data-eye')==="right"){
        this.setState({hideRightLid:true,rightEyeTouching:false})
    }
    else{
        this.setState({hideLeftLid:true,leftEyeTouching:false})
    }
  }

  onMouthTouchStart(e){
    window.location.reload();
  }
}


export default App;
