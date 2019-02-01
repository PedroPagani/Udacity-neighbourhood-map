import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'

class Sidebar extends Component {

    state = {
        query: ''
    }


    filterList = (e) => {
        const query = e.target.value;
        this.setState({query: query.trim()})
        const markers = this.props.venues.map(v => {
            const isMatch = v.venue.name.toLowerCase().includes(query.toLowerCase());
            const marker = this.props.markers.find(m => m.id === v.venue.id)
            if (isMatch) {
                marker.isVisible = true;
            } else {
                marker.isVisible = false;
            }
            return marker
        })
        this.props.filterMarkers({markers})
        
    } 


    render() {
        const venues = this.props.venues;
       
        return (
            <div>
                <input type="search" value={this.state.query} onChange={this.filterList}></input>
                <ul>
                    {venues.map((v) => (
                    <li key={v.venue.id} onClick={() => this.props.clickMarker(v)}>{v.venue.name}</li>
                    ))}
                </ul>

            </div>
          
        );
        
    }
}

export default Sidebar;