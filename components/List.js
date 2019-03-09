import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AsyncStorage, View, Text, ListView, Button } from 'react-native';
import {Actions} from 'react-native-router-flux';
import {TicketFetch} from '../actions';
import ListItem from './ListItem';

class List extends Component{
  onButtonPress() {
      Actions.FindTicket()
  }
  onVendiPress() {
      Actions.SellTicket()
  }

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
      <View>
        <ListView
            enableEmptySections
            dataSource={this.dataSource}
            renderRow= {this.renderRow}
            />
        <Button title="cerca" onPress={this.onButtonPress.bind(this) } />

        <Button title="vendi biglietto" onPress={this.onVendiPress.bind(this) } />
      </View>

    );
  }
}

const mapStateToProps = state => {
  //const displayName = state.displayName;
  const Ticket= _.map(state.Ticket, (val, uid) =>{
    return {...val, uid};
  });

  return { Ticket };
};

export default connect(mapStateToProps, { TicketFetch }) (List);
