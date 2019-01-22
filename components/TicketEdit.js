import _ from 'lodash';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import Comunications from 'react-native-communications';
import TicketForm from './TicketForm';
import {Actions} from 'react-native-router-flux';
import {TicketUpdate, TicketSave, TicketDelete} from '../actions';
import { Card, CardSection, Button, Confirm } from './common';

class TicketEdit extends Component {
  state = { showModal: false};

componentWillMount () {
  _.each(this.props.Ticket, (value, prop) => {
    this.props.TicketUpdate({ prop, value });
  });
}

onButtonPress() {
  const { city, number, shift}=this.props;

  this.props.TicketSave({ city, number, shift, uid: this.props.re.uid });
}

onTextPress() {
  const{ number, shift } = this.props;
  Comunications.text(number, ` giorno partenza: ${shift} `);
}


onAccept(){
  const { uid } = this.props.Ticket;
  this.props.TicketDelete({ uid });
}

onDecline(){
  this.setState({ showModal: false});
}

  render() {
    return (
      <Card>
        <TicketForm />
        <CardSection>
        <Button onPress= { this.onButtonPress.bind(this)}>
          Salva
        </Button>
        </CardSection>

        <CardSection>
        <Button onPress= {() => this.setState({ showModal: !this.state.showModal})}>
          Elimina
        </Button>
        </CardSection>

        <Confirm
          visible={ this.state.showModal }
          onAccept={this.onAccept.bind(this)}
          onDecline={this.onDecline.bind(this)}
        >
          eliminare?
        </Confirm>

      </Card>
    );
  }
}
const mapStateToProps = (state) => {
  const {city, number, shift } = state.TicketForm;

  return {city,number,shift};
};

export default connect(mapStateToProps, {TicketUpdate, TicketSave, TicketDelete })(TicketEdit);
