import React, {Component} from 'React';
import {Text} from 'react-native';
import {connect} from 'react-redux';
import {emailChanged, registerUser, passwordChanged, loginUser} from '../actions';
import {Card, CardSection, Input, Button, Spinner} from './common';

class LoginForm extends Component {
  onEmailChange (text){
    this.props.emailChanged(text);
  }

  onRegister(text){
    this.props.registerUser();
  }


  onPasswordChange(text){
    this.props.passwordChanged(text);
  }

  onButtonPress(){
    const {email, password }= this.props;

    this.props.loginUser({ email, password});
  }

  renderButton(){
    if(this.props.loading){
      return <Spinner size="large" />;
    }

    return (
      <Button onPress={this.onButtonPress.bind(this)}>
      Accedi
      </Button>
    );
  }

  // questo metodo renderizza la login
  render(){
    return (
      <Card>
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

      <Text style={styles.errorTextStyle}>
        {this.props.error}
      </Text>

      <CardSection>
        {this.renderButton()}
      </CardSection>
      <Text style={styles.registrati}>
          Non sei registrato? <Text onPress={this.onRegister.bind(this)} >Iscriviti</Text>
      </Text>
      </Card>
    );
  }
}

const styles={
  errorTextStyle:{
    fontSize:20,
    alignSelf:'center',
    color:'red'
  },
  registrati: {
    fontSize:20,
    alignSelf:'center'
  }
};

const mapStateToProps= ({auth}) => {
  const{ email, password, error, loading} = auth;
  return { email, password, error, loading};
};

export default connect(mapStateToProps, { emailChanged, registerUser, passwordChanged, loginUser }) (LoginForm);
