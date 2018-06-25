import React, {Component} from 'react';
import {connect} from 'react-redux';
import {TicketUpdate, TicketCreate } from '../actions';
import { Card, CardSection, Button} from './common';
import TicketForm from './TicketForm';

class Create extends Component{
  onButtonPress() {
    const {city, number, shift}=this.props;

    this.props.TicketCreate({city, number, shift: shift || 'Monday' });
  }

    render() {
      return (
        <Card>
          <TicketForm {...this.props}/>
          <CardSection>
            <Button onPress={this.onButtonPress.bind(this) } >
              Crea
              </Button>
          </CardSection>
        </Card>
      );
  }
}

const mapStateToProps = (state) => {
  const {city, number, shift } = state.TicketForm;

  return {city,number,shift};
};

export default connect (mapStateToProps, {TicketUpdate, TicketCreate })(Create);
