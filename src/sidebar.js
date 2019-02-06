import React, { Component } from 'react';

class Sidebar extends Component {

    
    


    render() {
     
        return (
            <div tabIndex="1" className="sidebar-container">
                
                <ul tabIndex="1">
                    {this.props.showing.length > 0 &&
                     this.props.showing.map((v) => (
                    <li tabIndex="1" key={v.venue.id} onClick={() => this.props.clickMarker(v)}>{v.venue.name}</li>
                    ))}
                </ul>

            </div>
          
        );
        
    }
}

export default Sidebar;