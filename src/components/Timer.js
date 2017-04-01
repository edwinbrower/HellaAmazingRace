'use strict';

import React from 'react';

const leftPad = (width, n) => {
  if ((n + '').length > width) {
    return n;
  }
  const padding = new Array(width).join('0');
  return (padding + n).slice(-width);
};

export default class Stopwatch extends React.Component {

  constructor(props) {
    super(props);
    
    // bind all functions to 'this' context immediately
    ['update', 'toggle'].forEach((method) => {
      this[method] = this[method].bind(this);
    });

    this.state = this.initialState = {
      isRunning: false,
      timeElapsed: 0,
    };
  }

  componentDidUpdate() {
    // start race on first checkpoint verify
    if (this.props.running) {
      this.props.running = false;
      this.toggle();
    }

    // end race and send results data to be stored in database
    if (this.props.complete) {
      this.props.complete = false;
      this.toggle();
      // const seconds = this.state.timeElapsed / 1000; // comment out next line and save to window
      const seconds = 56.789;
      this.saveTime(seconds);
    }
  }

  saveRaceResults(seconds) {
    let formattedTime = {
      min: Math.floor(seconds / 60).toString(),
      sec: Math.floor(seconds % 60).toString(),
      msec: (seconds % 1).toFixed(3).substring(2)
    };
    let raceResults = {
      title: this.props.raceTitle,
      winner: window.currentUser,
      time: JSON.stringify(formattedTime)
    };

    $.post('/saveRaceResults', raceResults)
      .done((res) => {
        console.log(res);
      });
  }

  toggle() {
    this.setState({isRunning: !this.state.isRunning}, () => {
      this.state.isRunning ? this.startTimer() : clearInterval(this.timer);
    });
  }

  startTimer() {
    this.startTime = Date.now();
    this.timer = setInterval(this.update, 10);
  }

  update() {
    const delta = Date.now() - this.startTime;
    this.setState({timeElapsed: this.state.timeElapsed + delta});
    this.startTime = Date.now();
  }

  render() {
    const {isRunning, timeElapsed} = this.state;
    return (
      <div>
        <TimeElapsed id="timer" timeElapsed={timeElapsed} />
      </div>
    );
  }
}

class TimeElapsed extends React.Component {
  getUnits() {
    const seconds = this.props.timeElapsed / 1000;
    return {
      min: Math.floor(seconds / 60).toString(),
      sec: Math.floor(seconds % 60).toString(),
      msec: (seconds % 1).toFixed(3).substring(2)
    };
  }

  render() {
    const units = this.getUnits();
    return (
      <div id={this.props.id}>
        <span>{leftPad(2, units.min)}:</span>
        <span>{leftPad(2, units.sec)}.</span>
        <span>{units.msec}</span>
      </div>
    );
  }
}

