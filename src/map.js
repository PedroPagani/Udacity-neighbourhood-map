import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import './App.css';





const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={11}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
    center={props.center}
  >
    {props.markers && 
        props.markers.filter(m => m.isVisible).map(marker => 
        <Marker key={marker.id} position={{ lat: marker.lat, lng: marker.lng }} onClick={() => props.clickMarker(marker)} animation={marker.isOpen ? 1 : 2}>
            {marker.isOpen && <InfoWindow>
                <React.Fragment>
                    <p className="teste">{marker.name}</p>
                    <p>{marker.location}</p>
                    <p>{marker.rating}</p>
                </React.Fragment>
                
            </InfoWindow>}
        </Marker>
        )}
  </GoogleMap>
))


class Map extends Component {
    render() {
        return (
            
            <MyMapComponent
                {...this.props}
                isMarkerShown
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDiUiaZDwQlXaI8O8yN_11KRcV6S_c-Iqw"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />

        )
    }   
}

export default Map