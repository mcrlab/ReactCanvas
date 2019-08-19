import React from 'react';
import Light from './Light';
  
export default class Graphic extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        x:0,
        y:0,
        touching: false,
        color: "000000",
        debounce: new Date().getTime()
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
      const now = new Date().getTime();

      if(now < this.state.debounce + 100){
        return;
      }
      let x = event.touches[0].clientX;
      let y = event.touches[0].clientY;

      let filteredLights = this.props.lights.filter((light)=> {
        let lightX = light.position.x * this.props.width;
        let lightY = light.position.y * this.props.height;
        let a = (
          (x > (lightX-25) && x < (lightX + 25)) && 
          (y > (lightY-25) && y < (lightY + 25)) 
        );
        return a;
      });


      if(this.props.dragMode){

        if(filteredLights[0]){
          let activeLight =  filteredLights[0];
          let currentColor = activeLight.color;
          activeLight.setColor("FF0000");
          this.setState({
            x: ((event.touches[0].clientX / this.props.width)),
            y: ((event.touches[0].clientY / this.props.height)),
            touching: true,
            color: currentColor,
            activeLight: activeLight
          });
    
        }
      } else {
        if(filteredLights[0]){
          filteredLights[0].setColor(this.props.color, this.props.animationTime);
        }
      }
    }

    handleOnTouchMove(event){
      let x = ((event.touches[0].clientX / this.props.width));
      let y = ((event.touches[0].clientY / this.props.height));
      this.setState({
        x: x,
        y: y
      });
    }

    handleOnTouchEnd(event){
      const now = new Date().getTime();
      if(this.state.activeLight){
        this.state.activeLight.setPosition({x:parseFloat(this.state.x), y:parseFloat(this.state.y), color:this.state.color});
      }
      this.setState({
        touching: false,
        activeLight: null,
        debounce: now
      });
    }

    paint() {
      const { width, height } = this.props;
      const context = this.refs.canvas.getContext("2d");
      context.clearRect(0, 0, width, height);
      context.save();
 
      this.props.lights.forEach((lightPoint)=>{
        lightPoint.paint(context);
      });

      if(this.state.touching){
        new Light(null, "FF0000", {x: this.state.x, y: this.state.y}).paint(context)
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