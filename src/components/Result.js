import React from 'react';

export default class Result extends React.Component {

  // should be using a fixed location and not current
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      lng: null,
    };
  }


  componentDidMount() {
    console.log('componentDidMount');
    window.players = {};
    this.getCurrentLocation((ready) => {
      if (ready) {
        // one time map render on page ready
        this.renderMap();
      }
    });
  }

  renderMap() {
    let currLoc = {lat: this.state.lat, lng: this.state.lng};
    // window.map = new google.maps.Map(document.getElementById('map'), {
    // // window.map = new google.maps.Map(document.getElementsByClassName('map'), {
    //   zoom: 18,
    //   center: currLoc
    // });
    window.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 20,
      center: currLoc
    });
    // window.marker = new google.maps.Marker({
    //   position: currLoc,
    //   icon: window.currentUserPic,
    //   map: map
    // });
    // marker.setAnimation(google.maps.Animation.BOUNCE);

    // var setMap = function (c){try{this.set(a,b(c))}catch(d){_.qc(_.pc("set"+_.Jb(a),d))}}

    // if (this.props.result.path) { // if is currently necessary for old db info w/o path
    //   var path = JSON.parse(this.props.result.path);
    //   console.log(path);
    //   // path.setMap(null);
    //   path.setMap(map);
    // }

    if (this.props.result.path) { // if is currently necessary for old db info w/o path
      var lineCoordinatesPath = new google.maps.Polyline({
        path: JSON.parse(this.props.result.path),
        geodesic: true,
        strokeColor: '#2E10FF'
      });
      console.log(lineCoordinatesPath);
      lineCoordinatesPath.setMap(map);
    }

  }

  getCurrentLocation(cb) {
    var options = {
      enableHighAccuracy: true,
      // timeout: 5000,
      timeout: 8000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition((location) => {
      this.setState({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });

      if (cb) {
        cb('Done fetching location, ready.');
      }
    }, (err) => {
      console.log('error occurred: ', err);
    }, options);
  }

// id not class
  render() {
    return (
      <div>
        <div>
          <img src={'http://s25.postimg.org/wha5p35q3/Mail-icon.png'} alt="" />
          <div id="map"></div>
        </div>
        <div>
          <div>
            {this.props.result.time}
          </div>
        </div>
      </div>
    );
  }
}
