import React, { Component } from 'react';
import { View, Text, Picker } from 'react-native';
import {connect} from 'react-redux';
import { TicketUpdate } from '../actions';
import { CardSection, Input } from './common';

class TicketForm extends Component {
    render() {
      return (
        <View>
        <CardSection>
          <Input
            label="Città"
            placeholder="Catania"
            value={this.props.city}
            onChangeText= {value => this.props.TicketUpdate({ prop: 'city', value })}
            />
        </CardSection>

        <CardSection>
        <Input
          label="Serie"
          placeholder="xxx-000-1111"
          value={this.props.number}
          onChangeText= {value => this.props.TicketUpdate({ prop: 'number', value })}
          />
        </CardSection>

        <CardSection style={{ flexDirection: 'column' }}>
          <Text style={styles.pickerTextStyle}> Partenza </Text>
          <Picker
            style= {{ flex:1 }}
            selectedValue={this.props.shift}
            onValueChange={value => this.props.TicketUpdate({ prop: 'shift', value })}
          >
            <Picker.Item label="Lunedì" value="Monday" />
            <Picker.Item label="Martedì" value="Tuesday" />
            <Picker.Item label="Mercoledì" value="Wednesday" />
            <Picker.Item label="Giovedì" value="Thursday" />
            <Picker.Item label="Venerdì" value="Friday" />
            <Picker.Item label="Sabato" value="Saturday" />
            <Picker.Item label="Domenica" value="Sunday" />
          </Picker>
        </CardSection>
        </View>
      );
    }
}

const styles = {
  pickerTextStyle: {
    fontSize: 18,
    paddingLeft: 20
  }
};

const mapStateToProps = (state) => {
  const {city, number, shift } = state.TicketForm;

  return {city,number,shift};
};


export default connect(mapStateToProps, { TicketUpdate })(TicketForm);
