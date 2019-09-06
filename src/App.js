import React from 'react';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Graphic from './Graphic';
import Light from './Light';
import ToolBar from './ToolBar'
import SimpleCard from './Card'
import API_URL from './url';
const client = new W3CWebSocket(`ws://${API_URL}`);



class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        lights: [],
        rotation: 0,
        dragMode: false,
        color: 'b80000',
        delay: 1000,
        animationTime: 0,
        optionsScreen: false
    };
    this.tick = this.tick.bind(this);
    this.setColor = this.setColor.bind(this);
    this.setDelay = this.setDelay.bind(this);
    this.setDragMode = this.setDragMode.bind(this);
    this.setAnimationTime = this.setAnimationTime.bind(this);
    this.handleSettings = this.handleSettings.bind(this);
  }
  
  tick() {
    const rotation = this.state.rotation + 0.04;
    this.setState({ rotation });
    requestAnimationFrame(this.tick);
  }

  updateDimensions() {
    let update_width  = window.innerWidth;
    let update_height = window.innerHeight;
    this.setState({ width: update_width, height: update_height });
  }

  componentDidMount(){
    requestAnimationFrame(this.tick);
  }

  componentWillMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));

    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      let lights = this.state.lights;
      switch(dataFromServer.instruction){
        case 'ALL_LIGHTS':
          let allLights = [];
          dataFromServer.data.lights.forEach((light)=>{
            let newLight = new Light(light.id, light.color, light.position);
            allLights.push(newLight);
          });
          this.setState({
            lights: allLights
          });
          break;
        case 'UPDATE_LIGHT':
            
            let updated = lights.map((item, index) => {
              if (item.id ===dataFromServer.data.id) {
                item.update(dataFromServer.data.color, dataFromServer.data.position, dataFromServer.data.time, dataFromServer.data.delay);
              }
              return item
             
            });
            this.setState({
              lights: updated
            });

            break;
          case 'ADD_LIGHT':

              let newLight = new Light(dataFromServer.data.id, dataFromServer.data.color, dataFromServer.data.position);
              lights.push(newLight);
              this.setState({
                lights: lights
              });
              break;
        default:
            break;
      }
    };
  }
  setDragMode(event) {
    this.setState({ 
      dragMode: !this.state.dragMode
    });
  }
  setColor(color){
    this.setState({ color: color.hex.replace('#','') });
  }
  
  setDelay(delay){
    this.setState({delay: delay});
  }

  setAnimationTime(animationTime){
    this.setState({animationTime})
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }
  handleSettings(optionsScreen){
    this.setState({optionsScreen});
  }

  render(){
    return (
      <div className="App">
          <ToolBar dragMode={this.state.dragMode} setDragMode={this.setDragMode} color={this.state.color} setColor={this.setColor} setDelay={this.setDelay} handleOpen={this.handleSettings} animationTime={this.state.animationTime} setAnimationTime={this.setAnimationTime}/>
          <Graphic dragMode={this.state.dragMode} color={this.state.color} animationTime={this.state.animationTime} delay={this.state.delay} lights={this.state.lights} width={this.state.width} height={this.state.height} />
          <SimpleCard show={this.state.optionsScreen} handleClose={this.handleSettings} animationTime={this.state.animationTime} setAnimationTime={this.setAnimationTime} color={this.state.color} setColor={this.setColor}/>
      </div>
    );
  }
}

export default App;
