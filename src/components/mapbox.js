'use strict';

import React from 'react';


export default class PubMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      lng: null,
      lineCoords: []
    }
  }

  componentDidMount() {
    setInterval(() => {
      console.log('getting location');
      this.getCurrentLocation((ready) => {
        if (ready) {
          this.renderMap();
        }
      });
    }, 3000);
  }

  renderMap() {
    let currLoc = {lat: this.state.lat, lng: this.state.lng};
    this.addLineCoordinates(currLoc);
    // save map to window to be able to redraw as current location changes
    window.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: currLoc
    });
    window.marker = new google.maps.Marker({
      position: currLoc,
      map: map
    });
  }

  getCurrentLocation(cb) {
    navigator.geolocation.getCurrentPosition((location) => {
      this.setState({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
      cb('Done fetching location, ready.');
    })
  }

  addLineCoordinates(coords) {
    let newCoords = this.state.lineCoords.slice();
    newCoords.push(coords);
    this.setState({
      lineCoords: newCoords
    });
  }

  redrawMap(payload) {
    let lat = payload.message.lat;
    let lng = payload.message.lng;

    map.setCenter({lat:lat, lng:lng, alt:0});
    marker.setPosition({lat:lat, lng:lng, alt:0});

    this.addLineCoordinates(new google.maps.LatLng(lat, lng));

    let lineCoordinatesPath = new google.maps.Polyline({
      path: this.state.lineCoords,
      geodesic: true,
      strokeColor: '#2E10FF'
    });

    lineCoordinatesPath.setMap(map);
  }

  pubnubConnect() {
    window.pnChannel = "map-channel";
    var pubnub = new PubNub({
      publishKey: 'pub-c-1e471fcb-f49a-481a-84ae-32b4e950ffa8',
      subscribeKey: 'sub-c-00a667ae-0a73-11e7-9734-02ee2ddab7fe'
    });
    pubnub.subscribe({channels: [pnChannel]});
    pubnub.addListener({message:this.redrawMap});
  }

  render() {
    return (
      <div id="map"></div>
    );
  }
}
