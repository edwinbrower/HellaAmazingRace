'use strict';

import React from 'react';
import Table from './Table';


export default class IndexPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      displayName: null,
      userPhoto: null,
    };
  }

  componentDidMount() {
    this.getUserData();

  }

  getUserData() {
    $.get('/username')
      .done((res) => {
        // allow all components access to current user name
        // console.log('hi', res);
        window.currentUser = res.displayName;
        // window.currentUserPic = res.photos[0].value;
        // console.log('pic', currentUserPic);
        this.setState({
          displayName: res.displayName,
          userPhoto: res.photos[0].value
        });
      });
  }

  render() {
    return (
      <div>

        <div className="text-center">
          <img className="img-circle" src={this.state.userPhoto}/>
          <span><h1>Welcome {this.state.displayName}</h1></span>
        </div>

        <div className="text-center">
          <h4>
            Recent race results
          </h4>
          <Table currentUser={this.state.displayName}/>
        </div>

      </div>
    );
  }
}