import React from 'react';
import Light from './Light';
  
export default class Graphic extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        x:0,
        y:0,
        touching: false,
        color: "000000"
      }
      
      this.paint = this.paint.bind(this);
      this.handleOnTouchStart = this.handleOnTouchStart.bind(this);
      this.handleOnTouchMove = this.handleOnTouchMove.bind(this);
      this.handleOnTouchEnd = this.handleOnTouchEnd.bind(this);
    }
  
    componentDidUpdate() {
      this.paint();
    }
  
    handleOnTouchStart(event){
      let x = ((event.touches[0].clientX / this.props.width).toFixed(2));
      let y = 1 - ((event.touches[0].clientY / this.props.height).toFixed(2));
      this.setState({
        x: x,
        y: y,
        touching: false
      });
    }

    handleOnTouchMove(event){
      let x = ((event.touches[0].clientX / this.props.width).toFixed(2));
      let y = 1 - ((event.touches[0].clientY / this.props.height).toFixed(2));
      this.setState({
        x: x,
        y: y,
        touching: true
      });
    }

    handleOnTouchEnd(event){
      fetch("/lights/position/LIGHT_ID",{
        method : "PUT",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({x:this.state.x, y:this.state.y})
        })
      .then(response=> response.json())
      .then(json => console.log(json));
      this.setState({
        touching: false
      });
    }

    paint() {
      const { width, height, rotation } = this.props;
      const context = this.refs.canvas.getContext("2d");
      context.clearRect(0, 0, width, height);
      context.save();
 
      this.props.lights.forEach((lightPoint)=>{
        new Light(lightPoint.color, lightPoint.position).paint(context);
      });
      if(this.state.touching){
        new Light("FF0000", {x: this.state.x, y: this.state.y}).paint(context)
      }
      context.restore();
    }
  
    render() {
      const { width, height } = this.props;
      return (
        <canvas
          onTouchStart={this.handleOnTouchStart}
          onTouchMove={this.handleOnTouchMove}
          onTouchEnd = {this.handleOnTouchEnd}
          ref="canvas"
          width={width}
          height={height}
        />
      );
    }
  }