import React, {Component} from 'React';
import { Text, Picker } from 'react-native';
import {connect} from 'react-redux';
import {Card, CardSection, Input, Button, Spinner} from './common';

class BuyTicketForm extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = props;
  }


  render(){
    return (
      <Card>
        <CardSection>
          <Text>
            {this.props.ticket.tipoTreno}
          </Text>
        </CardSection>
        <CardSection>
          <Text>
            da: {this.props.ticket.luogoPartenza} ({this.props.ticket.oraPartenza})
          </Text>
        </CardSection>
        <CardSection>
          <Text>
            a: {this.props.ticket.luogoArrivo} ({this.props.ticket.oraArrivo})
          </Text>
        </CardSection>
        <CardSection>
          <Text>
            Posto: {this.props.ticket.posto}
          </Text>
        </CardSection>
        <CardSection>
          <Text>
            Prezzo: {this.props.ticket.prezzoInserito}
          </Text>
        </CardSection>
        <CardSection>
          <Text>
            venduto da: {this.props.ticketOwner}
          </Text>
        </CardSection>
      </Card>
    );
  }
}

const styles={
  errorTextStyle:{
    fontSize:20,
    alignSelf:'center',
    color:'red'
  }
};

const mapStateToProps= ({auth}) => {
  const{ email, password, error, loading, user} = auth;
  return { email, password, error, loading, user};
};

export default connect(mapStateToProps, {}) (BuyTicketForm);
