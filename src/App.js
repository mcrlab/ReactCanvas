import React from 'react';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Graphic from './Graphic';
import Light from './Light';

const client = new W3CWebSocket(`ws://lantern.mcrlab.co.uk`);



class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        lights: [],
        rotation: 0
    };
    this.tick = this.tick.bind(this);
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
        case 'UPDATE':
            let lights = this.state.lights;
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
        default:
            break;
      }
    };
  }
  
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render(){
    return (
      <div className="App">
        <header className="App-header wrapper">
          <Graphic lights={this.state.lights} width={this.state.width} height={this.state.height} />
        </header>
      </div>
    );
  }
}

export default App;
