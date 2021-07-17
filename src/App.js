import React from "react";
import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import Geocode from "react-geocode";
import { Descriptions } from "antd";
import AutoComplete from "react-google-autocomplete";

Geocode.setApiKey("AIzaSyA_EOYO9sEGEk2pIQuQ_thRNoHNdfqTzSQ");

class App extends React.Component {
  state = {
    address: "",
    city: "",
    area: "",
    state: "",
    zoom: 15,
    height: 400,
    mapPosition: {
      lat: 0,
      lng: 0,
    },
    markerPosition: {
      lat: 0,
      lng: 0,
    },
  };

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState(
          {
            mapPosition: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            markerPosition: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          },
          () => {
            Geocode.fromLatLng(
              position.coords.latitude,
              position.coords.longitude
            ).then((response) => {
              const address = response.results[0].formatted_address;
              const addressArray = response.results[0].address_components;
              const city = this.getCity(addressArray);
              const area = this.getArea(addressArray);
              const state = this.getState(addressArray);
              console.log(response);
              this.setState({
                address: address ? address : "",
                area: area ? area : "",
                city: city ? city : "",
                state: state ? state : "",
              });
            });
          }
        );
      });
    }
  }

  getCity = (addressArray) => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_2" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };
  getArea = (addressArray) => {
    let area = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };
  getState = (addressArray) => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_1" === addressArray[i].types[0]
      ) {
        state = addressArray[i].long_name;
        return state;
      }
    }
  };

  onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat();
    let newLng = event.latLng.lng();

    Geocode.fromLatLng(newLat, newLng).then((response) => {
      const address = response.results[0].formatted_address;
      const addressArray = response.results[0].address_components;
      const city = this.getCity(addressArray);
      const area = this.getArea(addressArray);
      const state = this.getState(addressArray);

      this.setState({
        address: address ? address : "",
        area: area ? area : "",
        city: city ? city : "",
        state: state ? state : "",
        markerPosition: {
          lat: newLat,
          lng: newLng,
        },
        mapPosition: {
          lat: newLat,
          lng: newLng,
        },
      });
    });
  };
  onPlaceSelected = (place) => {
    const address = place.formatted_address;
    const addressArray = place.address_components;
    const city = this.getCity(addressArray);
    const area = this.getArea(addressArray);
    const state = this.getState(addressArray);
    const latValue = place.geometry.location.lat();
    const lngValue = place.geometry.location.lng();
    this.setState({
      address: address ? address : "",
      area: area ? area : "",
      city: city ? city : "",
      state: state ? state : "",
      markerPosition: {
        lat: latValue,
        lng: lngValue,
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue,
      },
    });
  };

  render() {
    const MapWithAMarker = withScriptjs(
      withGoogleMap((props) => (
        <GoogleMap
          defaultZoom={8}
          defaultCenter={{
            lat: this.state.mapPosition.lat,
            lng: this.state.mapPosition.lng,
          }}
        >
          <Marker
            draggable={true}
            onDragEnd={this.onMarkerDragEnd}
            position={{
              lat: this.state.markerPosition.lat,
              lng: this.state.markerPosition.lng,
            }}
          >
            <InfoWindow>
              <div>Hello</div>
            </InfoWindow>
          </Marker>
        </GoogleMap>
      ))
    );
    return (
      <div
        style={{
          padding: "1rem",
          margin: "0 auto",
          maxWidth: 1000,
        }}
      >
        <h1>Google Map Basic</h1>
        <Descriptions bordered>
          <Descriptions.Item label="City">{this.state.city}</Descriptions.Item>
          <Descriptions.Item label="Area">{this.state.area}</Descriptions.Item>
          <Descriptions.Item label="State">
            {this.state.state}
          </Descriptions.Item>
          <Descriptions.Item label="Addreass">
            {this.state.address}
          </Descriptions.Item>
        </Descriptions>
        <MapWithAMarker
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA_EOYO9sEGEk2pIQuQ_thRNoHNdfqTzSQ&=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
        <AutoComplete
          style={{
            width: "100%",
            height: "40px",
            paddingLeft: 16,
            marginTop: 2,
            marginBottom: "2rem",
          }}
          types={["(regions)"]}
          onPlaceSelected={this.onPlaceSelected}
        />
      </div>
    );
  }
}

export default App;
