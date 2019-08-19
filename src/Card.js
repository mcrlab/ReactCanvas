import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { GithubPicker } from 'react-color';
import { withStyles } from '@material-ui/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme =>({
  card: {
    minWidth: 275,
    position:"fixed",
    right: "10px",
    top: "10px"
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});


class SimpleCard extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          colors: ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB']
      }
      this.handleOnChange = this.handleOnChange.bind(this);
      this.handleClose = this.handleClose.bind(this);
  }
  handleOnChange(event, value){
    this.props.setAnimationTime(value);
  }
  handleClose(){
    this.props.handleClose(false);
  }
  render(){
    const { classes } = this.props;
    return (
     <Dialog
        open={this.props.show}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Options</DialogTitle>
        <DialogContent>
                <Typography className={classes.pos} color="textSecondary">
                Animation Time
                </Typography>
                
                <Slider
                    defaultValue={this.props.animationTime}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={500}
                    min={0}
                    max={3000}
                    onChange={this.handleOnChange}
                />

                <Typography className={classes.pos} color="textSecondary">
                Color
                </Typography>
                <GithubPicker color={this.props.color} onChangeComplete={ this.props.setColor } triangle="hide" colors={this.state.colors}/>
                </DialogContent>
                <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
        </Dialog>
    );
  }
}

export default withStyles(styles)(SimpleCard);