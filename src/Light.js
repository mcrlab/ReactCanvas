import React from 'react'
import { GithubPicker } from 'react-color';
export default class Light extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            delay: 0,
            time: 1000,
            colors: ['#FFFFFF', '#FF0000', '#FFFF00', '#0000FF', '#00FF00', '#00FFFF', '#FF00FF','#000000']
        };
       // this.lightOn = this.lightOn.bind(this);
    }
    handleChangeComplete = (color) => {

        fetch(`/lights/${this.props.id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"color":color.hex.replace("#",""), "time": 500})
        })
        .then(response => {
            return response.json()
        });
        
    }
    
    render(){
        let transitionDelay = this.props.delay / 1000 || 0;
        let transitionDuration = this.props.time / 1000 || 0;

        return (
            <div>
                <GithubPicker color={this.props.color} onChangeComplete={ this.handleChangeComplete } triangle="hide" colors={this.state.colors}/>
            </div>
            

        )
    }
}