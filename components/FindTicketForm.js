import React, {Component} from 'React';
import {connect} from 'react-redux';
import {View, Text, FlatList, StyleSheet} from 'react-native';
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

  onSelectLocation (text){
    var seen = [];
    this.setState({
      partenza: text,
      messaggio: "hai selezionato "+JSON.stringify(text,function(key, val) {
         if (val != null && typeof val == "object") {
              if (seen.indexOf(val) >= 0) {
                  return;
              }
              seen.push(val);
          }
          return val;
      })
    });
    //console.log(text);
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
          isLoaded: true,
          messaggio: "stringa troppo corta "+ text
        })
      }
  }

  render() {
    const { error, isLoaded, items, messaggio } = this.state;
    let messaggioRisposta = "";
    if (error) {
        messaggioRisposta = "Error" + error.message;
    } else if (!isLoaded) {
        messaggioRisposta = "Loading...";
    } else {
        messaggioRisposta = "Testo inserito:"+ messaggio;
    }
    return (<Card>
              <CardSection>
                <Input
                  label="Partenza"
                  placeholder="Partenza"
                  onChangeText={this.onTextChanged.bind(this)}
                  value={this.props.partenza}
                />
              </CardSection>
              <Text>{messaggioRisposta}</Text>
              <FlatList
                data={items}
                renderItem={({item}) => <Text onPress={() => this.onSelectLocation(item.name) } style={styles.item} >{item.name}</Text>}
              />
            </Card>);
  }
}

/*
{items.map(item => (
    <Text>{item.name} </Text>))
  }
*/

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  errorTextStyle:{
    fontSize:20,
    alignSelf:'center',
    color:'red'
  },
})

const mapStateToProps= ({auth}) => {
  const{ email, password, error, loading} = auth;
  return { email, password, error, loading};
};

export default connect(mapStateToProps, { textChanged }) (FindTicketForm);
