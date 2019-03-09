import React, {Component} from 'React';
import { Text, Picker } from 'react-native';
import {connect} from 'react-redux';
import {emailChanged, nameChanged, numeroCartaChanged, passwordChanged, signupUser} from '../actions';
import {Card, CardSection, Input, Button, Spinner} from './common';

class SignupForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      metodoPagamento: "carta"
    }
  }

  onEmailChange (text){
    this.props.emailChanged(text);
  }

  onNameChange (text){
    this.props.nameChanged(text);
  }

  onNumeroCartaChange (text){
    this.props.numeroCartaChanged(text);
  }

  onPasswordChange(text){
    this.props.passwordChanged(text);
  }

  onButtonPress(){
    const {email, password, displayName }= this.props;
    this.props.signupUser({ email, password, displayName});
  }

  renderButton(){
    if(this.props.loading){
      return <Spinner size="large" />;
    }

    return (
      <Button onPress={this.onButtonPress.bind(this)}>
      Iscriviti
      </Button>
    );
  }

  render(){
    return (
      <Card>
      <CardSection>
        <Input
          label="Nome completo"
          placeholder="Pippo Baudo"
          onChangeText={this.onNameChange.bind(this)}
          value={this.props.displayName}
        />
      </CardSection>

      <CardSection>
          <Input
          label="Email"
          placeholder="email@gmail.com"
          onChangeText={this.onEmailChange.bind(this)}
          value={this.props.email}
          />
      </CardSection>

      <CardSection>
        <Input
          secureTextEntry
          label="Password"
          placeholder="password"
          onChangeText={this.onPasswordChange.bind(this)}
          value={this.props.password}
        />
      </CardSection>
      <CardSection>
        <Picker
          selectedValue={this.state.metodoPagamento}
          style={{height: 70, width: 250}}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({metodoPagamento: itemValue})
          }>
          <Picker.Item label="Carta Credito/Debito" value="carta" />
          <Picker.Item label="Paypal" value="paypal" />
        </Picker>
      </CardSection>
      <CardSection>
        <Input
          label="Numero carta"
          placeholder="Numero carta"
          onChangeText={this.onNumeroCartaChange.bind(this)}
          value={this.props.numeroCarta}
        />
      </CardSection>

      <Text style={styles.errorTextStyle}>
        {this.props.error}
      </Text>

      <CardSection>
        {this.renderButton()}
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
  const{ email, password, metodoPagamento, displayName, error, loading} = auth;
  return { email, password, metodoPagamento, displayName, error, loading};
};

export default connect(mapStateToProps, { nameChanged, numeroCartaChanged, emailChanged, passwordChanged, signupUser }) (SignupForm);
