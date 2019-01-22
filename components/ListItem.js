import React, {Component} from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {CardSection} from './common';

class ListItem extends Component {
  onRowPress(){
    Actions.TicketEdit({ Ticket: this.props.Ticket });
  }
  render() {
    const { luogoArrivo, luogoPartenza }= this.props.Ticket;

    return (
      <TouchableWithoutFeedback onPress={this.onRowPress.bind(this)}>
        <View>
        <CardSection>
          <Text style= { styles.titleStyle}>
            {luogoPartenza} -> {luogoArrivo}
          </Text>
        </CardSection>
      </View>
    </TouchableWithoutFeedback>
    );
  }
}

const styles= {
  titleStyle: {
    fontSize: 18,
    paddingLeft:15
  }
};

export default ListItem;
