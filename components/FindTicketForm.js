import React, {Component} from 'React';
import {connect} from 'react-redux';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {textChanged} from '../actions';
import {Card, CardSection, Input, Button, Spinner} from './common';
import DatePicker from 'react-native-datepicker'

class FindTicketForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      messaggio: "",
      isSelected: false,
      date:"12/01/2018"
    };
  }

  onSelectLocation (text){
    var seen = [];
    if(this.state.isPartenza) {
      this.setState({
        partenza: text,
        messaggio: "hai selezionato "+ text,
        isSelected: true,
        items: null
      });
    } else {
      this.setState({
        destinazione: text,
        messaggio: "hai selezionato "+ text,
        isSelected: true,
        items: null
      });
    }
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
    const { error, isSelected, partenza, destinazione, isLoaded, items, messaggio } = this.state;
    let messaggioRisposta = "";
    if (error) {
        messaggioRisposta = "Error" + error.message;
    } else if (!isLoaded) {
        messaggioRisposta = "Loading...";
    } else if(isSelected) {
        messaggioRisposta = "";
    } else {
        messaggioRisposta = "Testo inserito:"+ messaggio;
    }
    return (<Card>
              <CardSection>
                <Input
                  {...this.props}
                  label="Partenza"
                  placeholder="Partenza"
                  onChangeText={(text) => {this.setState({partenza:text, isPartenza: true}); this.onTextChanged(text)}}
                  value={this.state.partenza}
                />
              </CardSection>
              <CardSection>
                <Input
                  {...this.props}
                  label="Destinazione"
                  placeholder="Destinazione"
                  onChangeText={(text) => {this.setState({destinazione:text, isPartenza: false}); this.onTextChanged(text)}}
                  value={this.state.destinazione}
                />
              </CardSection>
              <Text>{messaggioRisposta}</Text>
              <FlatList
                data={items}
                renderItem={({item}) => <Text onPress={() => this.onSelectLocation(item.name) } style={styles.item} >{item.name}</Text>}
                keyExtractor={(item, index) => index.toString()}
              />
              <CardSection>
                <DatePicker
                  style={{width: 200}}
                  date={this.state.date}
                  mode="date"
                  placeholder="select date"
                  format="DD/MM/YYYY"
                  minDate="01/01/2018"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => {this.setState({date: date})}}
                />
              </CardSection>
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
