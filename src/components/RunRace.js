'use strict';

import React from 'react';
import PubMap from './PubMap';
import Autocomplete from './Autocomplete';
import Timer from './Timer';



export default class RunRace extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchedRace: 'test',
      markers: null,
      title: null,
      raceComplete: false,
      raceRunning: false
    };

    // get users name for saving race results when page is loading.
    $.get('/username')
      .done((res) => {
        // console.log('in RR', res);
        window.currentUser = res.displayName;
        window.currentUserPic = res.photos[0].value;
      });
  }

  searchedRaceNameChange(e) {
    this.setState({
      searchedRace: e.target.value
    });
  }

  loadRace() {
    let raceTitle = { title: this.state.searchedRace };

    $.post('/loadRace', raceTitle, (response) => {
      if (response === 'Race doesn\'t exist') {
        alert('Race title doesn\'t exist, search again.');
      } else {
        window.checkpointsLoaded = false;
        this.setState({
          markers: response,
          title: this.state.searchedRace
        });
      }
    });
  }

///////////////ADDED THIS
  saveRaceResults(seconds, lineCoords) {
    let formattedTime = {
      min: Math.floor(seconds / 60).toString(),
      sec: Math.floor(seconds % 60).toString(),
      msec: (seconds % 1).toFixed(3).substring(2)
    };
    let raceResults = {
      // title: this.props.raceTitle,
      title: 'test',
      winner: window.currentUser,
      time: JSON.stringify(formattedTime),
      path: JSON.stringify(lineCoords)
    };

    $.post('/saveRaceResults', raceResults)
      .done((res) => {
        console.log(res);
      });
  }
/////////////////////////





  verifyLocation() {
    // if not running, start running race when checking start checkpoint location
    if (!this.state.raceRunning) {
      this.setState({
        raceRunning: true
      });
    }

    let currLocation = new google.maps.LatLng( window.currentLocation[0], window.currentLocation[1] );
    let checkpointLocation = new google.maps.LatLng( window.markers[0].getPosition().lat(), window.markers[0].getPosition().lng() );
    let distance = google.maps.geometry.spherical.computeDistanceBetween(currLocation, checkpointLocation);

    if (distance < 50) {
      window.markers[0].setMap(null);
      window.markers.shift();
      if (!window.markers.length) {
        alert('Congrats, you have finished the race!');
        this.setState({
          raceComplete: true
        });
      } else {
        window.markers[0].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        alert('Continue to next checkpoint!');
      }
    } else {
      alert(`You are still ${Math.floor(distance)} meters away.`);
    }
  }

  render() {

    const verifyBtnStyle = {
      'width': '800px',
      'margin-left': 'auto',
      'margin-right': 'auto'
    };

    return (
      <div className="text-center">
        <h1 className="text-center"> Run a Race</h1>
        <h3 className="text-center"> {this.state.title ? `Get Ready to start ${this.state.title}!` : ''}</h3>

        <form>
          <input type="text" value={this.state.searchedRace} onChange={this.searchedRaceNameChange.bind(this)}/>
          <button type="button" className="btn btn-primary" onClick={this.loadRace.bind(this)}>Load Race</button>
        </form>

        <Timer 
          raceTitle={this.state.title} 
          running={this.state.raceRunning} 
          complete={this.state.raceComplete}
          saveRaceResults={this.saveRaceResults.bind(this)}
        />

        <div style={verifyBtnStyle}>
          <button type="button" className="btn btn-success btn-block" onClick={this.verifyLocation.bind(this)}>I Have Arrived at Current Checkpoint</button>
        </div>


        <PubMap 
          markers={this.state.markers}
          saveRaceResults={this.saveRaceResults.bind(this)}
        />
      </div>
    );
  }
}