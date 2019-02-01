import React, { Component } from 'react';
import Map from './map'
import Sidebar from './sidebar'
//import { debounce } from 'lodash';
import './App.css';

class App extends Component {

  state = {
    venues: [],
    markers: [],
    center: [],
    info: []
  }


  closeMarkers = () => {
    const markers = this.state.markers.map(m => {
      m.isOpen =  false;
      return m;
    })
    this.setState({markers : Object.assign(this.state.markers, markers)})
  }

  handleMarkerClick = (marker) => {
    this.closeMarkers();
   
    
    const clientId = "IK42VKWGKV5YBKBWAGURCWPZIB0DDABDSEZA1AFZHLIGUG5Z"
    const clientSecret = "BZNLT0ZTUHEPMX1PU3GJFS0HYNKXQUI1R3WT3FQQVLSQOFXI"

    fetch(`https://api.foursquare.com/v2/venues/${marker.id}?client_id=${clientId}&client_secret=${clientSecret}&v=20180323`)
      .then(response => response.json())
      .then(data => {

        const found = this.state.markers.find((m) => m.id === marker.id)
        found.rating = data.response.venue.rating
        found.isOpen = true
        this.setState({markers: Object.assign(this.state.markers, found)})
        })
      .catch(erro => console.log(erro))

  

    

    
  }

  listClick = (venue) => {
    const targetMarker = this.state.markers.find(marker => marker.id === venue.venue.id)
    this.handleMarkerClick(targetMarker);
  }

  updateState = (markers) => {
    this.setState({markers: Object.assign(this.state.markers, markers)})
  }
  


  componentDidMount() {
    const clientId = "IK42VKWGKV5YBKBWAGURCWPZIB0DDABDSEZA1AFZHLIGUG5Z"
    const clientSecret = "BZNLT0ZTUHEPMX1PU3GJFS0HYNKXQUI1R3WT3FQQVLSQOFXI"

    // verificar se vai ser explore ou search
    fetch(`https://api.foursquare.com/v2/venues/explore?client_id=${clientId}&client_secret=${clientSecret}&v=20180323&near=campinas`)
    .then(response => {
        return response.json();
    })
    .then(responseJson => {
      //console.log(responseJson);
      const venues = responseJson.response.groups[0].items
      const center = responseJson.response.geocode.center
      const markers = venues.map(v => {
        return {
          lat: parseFloat(v.venue.location.lat),
          lng: parseFloat(v.venue.location.lng),
          isVisible: true,
          isOpen: false,
          location: v.venue.location.address,
          name: v.venue.name,
          id: v.venue.id
          
        }
      })
      this.setState({venues, markers, center})
      })
    .catch(error => {
        console.log("deu erro!" + error);
    });


  }




  render() {
    //console.log(this.state)
    return (
      <div className="App">
        <Map markers={this.state.markers} venues={this.state.venues} center={this.state.center} clickMarker={this.handleMarkerClick}></Map>
        <Sidebar venues={this.state.venues} markers={this.state.markers} clickMarker={this.listClick} filterMarkers={this.updateState}></Sidebar>
      </div>
    );
  }
}

export default App;
