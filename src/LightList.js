import React from 'react';
import Light from './Light';

class LightList extends React.Component {
    constructor(props){
        super(props);
    }
    
    render(){
        const lights = this.props.lights.map((item, key)=>
            <Light key={item.id} id={item.id} color={item.color} delay={item.delay||0} time={item.time||0} />
        )
        return (
            <div>                
                <ul>
                    {(lights.length > 0)?
                        lights
                    :
                    <h1>No Lights.</h1>
                    }
                </ul>

            </div>
        )
    }
}

export default LightList