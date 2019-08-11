import React from 'react';
import './App.css';
import LightList from './LightList';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Graphic from './Graphic';

const client = new W3CWebSocket(`ws://localhost`);



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

  componentDidMount(){
    requestAnimationFrame(this.tick);
  }

  componentWillMount() {


    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log(dataFromServer);
      switch(dataFromServer.instruction){
        case 'ALL_LIGHTS':
          this.setState({
            lights: dataFromServer.data.lights
          });
          break;
        case 'UPDATE':
            let lights = this.state.lights;
            let updated = lights.map((item, index) => {
              if (item.id !==dataFromServer.data.id) {
                // This isn't the item we care about - keep it as-is
                return item
              }
          
              // Otherwise, this is the one we want - return an updated value
              return {
                ...item,
                ...dataFromServer.data
              }
            });
            this.setState({
              lights: updated
            });

            break;
      }
    };
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <LightList lights={this.state.lights} />
          <Graphic lights={this.state.lights} width={500} height={500} />
        </header>
      </div>
    );
  }
}

export default App;
