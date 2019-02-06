import React, { Component } from 'react';
import Map from './map'
import Sidebar from './sidebar'
import Search from './Search'
import escapeRegExp from 'escape-string-regexp'
import './App.css';



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Não foi possível carregar o Google Maps</h1>;
    }

    return this.props.children; 
  }
}



class App extends Component {

  state = {
    venues: [],
    markers: [],
    center: [],
    info: [],
    query: '',
    showing: [],
    listIsOpen: false
  }

  //Atualiza todos as keys (isOpen:) dos markers para false ao fechar a infoWindow
  closeMarkers = () => {
    const markers = this.state.markers.map(m => {
      m.isOpen =  false;
      return m;
    })
    // Object.assign atualiza os valores em uma array de objetos
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
      .catch((error) => {
        window.alert("Não foi possível acessar as informações " + error)
      }) 
    
  }

  //Quando clica no nome da lista, abre o infoWindow no maps
  //É chamada no sidebar.js que envia o nome que foi clicado
  listClick = (venue) => {
    const targetMarker = this.state.markers.find(marker => marker.id === venue.venue.id)
    this.handleMarkerClick(targetMarker);
  }


  //Atualiza o array de markers.
  //Com Object.assign ele atualiza a key isVisible: que vem da função filterList
  updateState = (markers) => {
    this.setState({markers: Object.assign(this.state.markers, markers)})
  }
  


  componentDidMount() {
    

    const clientId = "IK42VKWGKV5YBKBWAGURCWPZIB0DDABDSEZA1AFZHLIGUG5Z"
    const clientSecret = "BZNLT0ZTUHEPMX1PU3GJFS0HYNKXQUI1R3WT3FQQVLSQOFXI"

    
    fetch(`https://api.foursquare.com/v2/venues/explore?client_id=${clientId}&client_secret=${clientSecret}&v=20180323&near=campinas`)
    .then(response => {
        return response.json();
    })
    .then(responseJson => {
      //console.log(responseJson);
      const venues = responseJson.response.groups[0].items
      const showing = responseJson.response.groups[0].items
      const center = responseJson.response.geocode.center
      //Cria os markers (objetos e coloca em um array no state) com base nos valores retornados dos venues
      //
      const markers = venues.map(v => {
        return {
          //parseFloat era pra corrigir o erro do setCenter do google maps
          lat: parseFloat(v.venue.location.lat),
          lng: parseFloat(v.venue.location.lng),
          isVisible: true,
          isOpen: false,
          location: v.venue.location.address,
          name: v.venue.name,
          id: v.venue.id
          
        }
      })
      this.setState({venues, markers, center, showing})
      })
    .catch(error => {
        console.log("Não foi possível acessar as informações " + error);
    });
  }


  //filtra a lista e os markers no mapa
  filterList = (e) => {
    const query = e.target.value;
    this.setState({query: query.trim()})

    //Aqui filtra os markers
    const markers = this.state.venues.map(v => {
        const isMatch = v.venue.name.toLowerCase().includes(query.toLowerCase());
        const marker = this.state.markers.find(m => m.id === v.venue.id)
        if (isMatch) {
            marker.isVisible = true;
        } else {
            marker.isVisible = false;
        }
        return marker
    })

    //Aqui filtra a lista
    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      this.setState({showing: this.state.venues.filter((v) => match.test(v.venue.name))}) 
    } else {
      this.setState({showing: this.state.venues}) 
    }
    this.updateState({markers})
} 


// Abri ou fecha a lista de nomes dos locais
showList = () => {
  const isOpen = this.state.listIsOpen
  if (isOpen) {
    this.setState({listIsOpen: false})
  } else {
    this.setState({listIsOpen: true})
  }
}


  render() {
    //console.log(this.state)

    return (
      <div className="App">
        <Search 
          role="search"
          value={this.state.query} 
          filterList={this.filterList}
          showList={this.showList} ></Search>
        <div className="link-foursquare">
          <a href="https://developer.foursquare.com/">Powered by foursquare</a>
        </div>

        <div className="map-sidebar-container">
          {this.state.listIsOpen &&
            <Sidebar
              tabIndex="1"
              role="application" 
              venues={this.state.venues} 
              markers={this.state.markers} 
              clickMarker={this.listClick} 
              showing={this.state.showing}></Sidebar>
          }
          <ErrorBoundary>
            <Map 
              tabIndex="2"
              markers={this.state.markers} 
              venues={this.state.venues} 
              center={this.state.center} 
              clickMarker={this.handleMarkerClick}></Map>

          </ErrorBoundary>
          
          </div>
      </div>
    );
  }
}

export default App;
