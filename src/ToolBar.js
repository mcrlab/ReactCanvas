import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import { GithubPicker } from 'react-color';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import FormLabel from '@material-ui/core/FormLabel';
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
  text: {
    paddingRight: "15px",
  }
});

class ToolBar extends React.Component {

  constructor(props){
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.state = {
      colors: ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB']
    }
  }

  handleOnChange(event, value){
    this.props.setAnimationTime(value);
  }

  render(){
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="grey">
          <Toolbar variant="dense">
          <Typography variant="h6" className={classes.text}>
            Colour
          </Typography>
            <div className={classes.text}>
              <GithubPicker color={`#${this.props.color}`} onChangeComplete={ this.props.setColor } triangle="hide" colors={this.state.colors}/>  
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
                    onChange={this.handleOnChange}
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
