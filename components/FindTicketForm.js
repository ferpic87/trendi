import React, {Component} from 'React';
import {connect} from 'react-redux';
import {View, Text} from 'react-native';
import {textChanged} from '../actions';
import {Card, CardSection, Input, Button, Spinner} from './common';

class FindTicketForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      messaggio: ""
    };
  }



  onTextChanged (text){
    if(text.length >= 2) {
      fetch("https://www.lefrecce.it/msite/api/geolocations/locations?name="+text)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result,
              messaggio: text
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: false,
              error,
              messaggio: text
            });
          }
        )
      } else {
        this.setState({
          isLoaded: false,
          messaggio: "stringa troppo corta "+ text
        })
      }
  }

  render() {
    const { error, isLoaded, items, messaggio } = this.state;
    if (error) {
      return (<Card>
                <CardSection>
                  <Input
                    label="Partenza"
                    placeholder="Partenza"
                    onChangeText={this.onTextChanged.bind(this)}
                    value={this.props.partenza}
                  />
                </CardSection>
                <Text>
                  Error: {error.message}
                </Text>
              </Card>
          );
    } else if (!isLoaded) {
      return (<Card>
                <CardSection>
                  <Input
                    label="Partenza"
                    placeholder="Partenza"
                    onChangeText={this.onTextChanged.bind(this)}
                    value={this.props.partenza}
                  />
                </CardSection>
                <Text>Loading...</Text>
              </Card>);
    } else {
      return (<Card>
                <CardSection>
                  <Input
                    label="Partenza"
                    placeholder="Partenza"
                    onChangeText={this.onTextChanged.bind(this)}
                    value={this.props.partenza}
                  />
                </CardSection>
                <Text>Testo inserito {messaggio}</Text>
                {items.map(item => (
                    <Text>{item.name} {item.id} </Text>))
                  }
              </Card>);
    }
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
  const{ email, password, error, loading} = auth;
  return { email, password, error, loading};
};

export default connect(mapStateToProps, { textChanged }) (FindTicketForm);
