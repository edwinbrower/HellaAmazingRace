import React from 'react';
import Result from './Result';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

export default class NoDataTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      raceResults: []
    };
  }

  componentDidMount() {
    this.getRaceResults();
  }

  getRaceResults() {
    $.post('/loadRaceResults')
      .done((res) => {
        this.setState({
          raceResults: res
        });
      });
  }

  // imageFormatter() {
  //   return '<img src="holder.js/100x150">';
  // }
        // <TableHeaderColumn dataField='path' data-formatter="imageFormatter">Path</TableHeaderColumn>
// try to filter the maps that arent current user
  render() {
    return (
      <div>
        <div>
          <BootstrapTable data={ this.state.raceResults } options={ { noDataText: 'No results to report, run a race!' } }>
            <TableHeaderColumn dataField='title' isKey={ true }>Title</TableHeaderColumn>
            <TableHeaderColumn dataField='winner'>Winner</TableHeaderColumn>
            <TableHeaderColumn dataField='time'>Time</TableHeaderColumn>
          </BootstrapTable>
        </div>
        <h4> 
          My Paths 
        </h4>
        {this.state.raceResults.map((result) => 
          <Result 
            key={result['_id']}
            result={result}
          />
        )}
      </div>
    );
  }
}


          // <Result 
          //   result={this.state.raceResults[this.state.raceResults.length - 1]}
          // />