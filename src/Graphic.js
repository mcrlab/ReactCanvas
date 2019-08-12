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


      if(filteredLights[0]){
        let activeLight =  filteredLights[0];

        this.setState({
          x: ((event.touches[0].clientX / this.props.width)),
          y: ((event.touches[0].clientY / this.props.height)),
          touching: true,
          activeLight: activeLight
        });
  
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
      
      if(this.state.activeLight){
        this.state.activeLight.setPosition({x:parseFloat(this.state.x), y:parseFloat(this.state.y)});

      }
      this.setState({
        touching: false,
        activeLight: null
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