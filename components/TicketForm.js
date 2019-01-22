import React, { Component } from 'react';
import { View, Text, Picker } from 'react-native';
import {connect} from 'react-redux';
import { TicketUpdate } from '../actions';
import { CardSection, Input } from './common';

class TicketForm extends Component {
    render() {
      console.log(this.props);
      return (
        <View>
          <CardSection>
            <Text style= { styles.titleStyle}>
              Partenza: {this.props.luogoPartenza} ({this.props.oraPartenza})
            </Text>
          </CardSection>
          <CardSection>
            <Text style= { styles.titleStyle}>
              Arrivo: {this.props.luogoArrivo} ({this.props.oraArrivo})
            </Text>
          </CardSection>
          <CardSection>
            <Text style= { styles.titleStyle}>
              Tipo treno: {this.props.tipoTreno} Posto: {this.props.posto}
            </Text>
          </CardSection>
          <CardSection>
            <Text style= { styles.titleStyle}>
              PNR: {this.props.pnr} Prezzo: {this.props.prezzoInserito} €
            </Text>
          </CardSection>
        </View>
      );
    }
}

const styles = {
  pickerTextStyle: {
    fontSize: 18,
    paddingLeft: 20
  },
  titleStyle: {
    fontSize: 18,
    paddingLeft:15
  }
};

const mapStateToProps = (state) => {

  const {luogoArrivo, luogoPartenza, oraArrivo, oraPartenza, pnr, posto, prezzoInserito, tipoTreno } = state.TicketForm;

  return {luogoArrivo, luogoPartenza, oraArrivo, oraPartenza, pnr, posto, prezzoInserito, tipoTreno };
};


export default connect(mapStateToProps, { TicketUpdate })(TicketForm);
