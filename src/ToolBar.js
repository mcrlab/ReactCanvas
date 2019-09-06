import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import { GithubPicker } from 'react-color';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Color from 'color'

const styles = theme =>({
  root: {
    flexGrow: 1,
    position: "fixed",
    bottom:0,
    left:0,
    width: "100%"
  },
  title: {
    flexGrow: 1,
    paddingRight: "15px"
  },
  colorGroup: {
    flexGrow: 1,
    paddingRight: "15px",
    position:"relative",
  },
  text: {
    paddingRight: "15px",
  },
  picker: {
    position: "absolute",
    left:0,
    top: -50
  }
});

class ToolBar extends React.Component {

  constructor(props){
    super(props);
    this.handleChangeAnimationTime = this.handleChangeAnimationTime.bind(this);
    this.handleChangeDelay = this.handleChangeDelay.bind(this);
    this.handleColorToggle = this.handleColorToggle.bind(this);
    this.state = {
      colors: ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB'],
      showColorPicker: false,
    }
  }

  handleColorToggle(){
    let showPicker = this.state.showColorPicker;
    this.setState({
      showColorPicker : !showPicker
    });
  }
  
  handleChangeAnimationTime(event, value){
    this.props.setAnimationTime(value);
  }

  handleChangeDelay(event, value){
    this.props.setDelay(value);
  }


  render(){
    const { classes } = this.props;
    const colorVisible = (this.state.showColorPicker)?"block":"none";
    const buttonTextColor = Color("#"+this.props.color).isLight()?"black":"white";

    return (
      <div className={classes.root}>
        <AppBar position="static" color="grey">
          <Toolbar variant="dense">
          <div className={classes.colorGroup}>
            <Button style={{"backgroundColor":"#" + this.props.color, "color":buttonTextColor}} onClick={ this.handleColorToggle }>Colour</Button>
            <div className={classes.picker} style={{ display: colorVisible}}>
              <GithubPicker color={`#${this.props.color}`} onChangeComplete={ this.props.setColor } triangle="hide" colors={this.state.colors}/>  
            </div>
            </div>

            <Typography variant="h6" className={classes.text}>
              Animation Time
            </Typography>
            <div className={classes.title}>

              <Slider
                    defaultValue={this.props.animationTime}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={500}
                    min={0}
                    max={3000}
                    onChange={this.handleChangeAnimationTime}
                />

            </div>
            <Typography variant="h6" className={classes.text}>
              Delay
            </Typography>
            <div className={classes.title}>
              <Slider
                    defaultValue={this.props.delay}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={500}
                    min={1000}
                    max={5000}
                    onChange={this.handleChangeDelay}
                />
            </div>
            <Typography variant="h6" className={classes.text}>
              Drag Mode
            </Typography>
            <Switch
              checked={this.props.dragMode}
              onChange={this.props.setDragMode}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(ToolBar);
