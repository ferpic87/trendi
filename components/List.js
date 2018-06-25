import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AsyncStorage, View, Text, ListView } from 'react-native';
import {TicketFetch} from '../actions';
import ListItem from './ListItem';

class List extends Component{
  componentWillMount() {
    this.props.TicketFetch();
    this.createDataSource(this.props);
  }

  componentWillReceiveProps(nextProps) {
      this.createDataSource(nextProps);
  }

  createDataSource({ Ticket }) {
    const ds= new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

      this.dataSource=ds.cloneWithRows(Ticket);
  }

  renderRow(Ticket) {
    return <ListItem Ticket= {Ticket} />;
  }

  render (){
    return(
      <ListView
          enableEmptySections
          dataSource={this.dataSource}
          renderRow= {this.renderRow}
          />
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  //const displayName = state.displayName;
  const Ticket= _.map(state.Ticket, (val, uid) =>{
    return {...val, uid};
  });

  return { Ticket };
};

export default connect(mapStateToProps, { TicketFetch }) (List);
