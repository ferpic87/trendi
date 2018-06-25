import React, {Component} from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {CardSection} from './common';

class ListItem extends Component {
  onRowPress(){
    Actions.TicketEdit({ Ticket: this.props.Ticket });
  }
  render() {
    const { city }= this.props.Ticket;

    return (
      <TouchableWithoutFeedback onPress={this.onRowPress.bind(this)}>
        <View>
        <CardSection>
          <Text style= { styles.titleStyle}>
            {city}
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
