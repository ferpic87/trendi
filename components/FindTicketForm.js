import React, {Component} from 'React';
import {connect} from 'react-redux';
import {View, Text, FlatList, StyleSheet, Keyboard} from 'react-native';
import {textChanged} from '../actions';
import {Card, CardSection, Input, Button, Spinner} from './common';
//import DatePicker from 'react-native-datepicker'
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Table, Row, Rows } from 'react-native-table-component';
import moment from 'moment';

class FindTicketForm extends Component {

  constructor(props) {
    super(props);
    var dataDiOggi = moment().format('DD/MM/YYYY H:mm');
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      messaggio: "",
      isSelected: false,
      isDateTimePickerVisible: false,
      dataPartenzaString: dataDiOggi,
      dataPartenza: moment(),
      tableHead: ['Partenza', 'Arrivo', 'Treno', 'Prezzo'],
      tableData: [
        //['Napoli C.le\n12:35', 'Milano C.le\n15:55', 'Frecciarossa 1000', '11.5€']
      ]
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

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = (date) => {
    this.setState({
                  dataPartenzaString: moment(date).format('DD/MM/YYYY H:mm'),
                  dataPartenza: moment(date)});
    this.hideDateTimePicker();
    Keyboard.dismiss();
  };

  convertResultToTable = (result) => {
    
  }

  onButtonPress(){
    //https://www.lefrecce.it/msite/api/solutions?origin=MILANO%20CENTRALE&destination=ROMA%20TERMINI&arflag=A&adate=10/01/2019&atime=17&adultno=1&childno=0&direction=A&frecce=false&onlyRegional=false
    var dataGiorno = this.state.dataPartenza.format('DD/MM/YYYY');
    var dataOra = this.state.dataPartenza.format('H');
    fetch("https://www.lefrecce.it/msite/api/solutions?origin="+this.state.partenza+"&destination="+this.state.destinazione+"&arflag=A&adate="+dataGiorno+"&atime="+dataOra+"&adultno=1&childno=0&direction=A&frecce=true&onlyRegional=false")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            tableData: convertResultToTable(result)
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          alert("Errore")
        }
      );
  }

  render() {
    const { error, isSelected, partenza, destinazione, isLoaded, dataPartenzaString, dataPartenza, oraPartenzaString, isDateTimePickerVisible, items, messaggio } = this.state;
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
                <Input onFocus={this.showDateTimePicker}
                  label="Data/Ora partenza"
                  value={this.state.dataPartenzaString}
                />
              </CardSection>
              <CardSection>
                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this.handleDatePicked}
                  onCancel={this.hideDateTimePicker}
                  mode='datetime'
                />
              </CardSection>
              <CardSection>
                <Button onPress={this.onButtonPress.bind(this)}>
                Cerca
                </Button>
              </CardSection>
              <View >
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                  <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
                  <Rows data={this.state.tableData} textStyle={styles.text}/>
                </Table>
              </View>
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
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
})

const mapStateToProps= ({auth}) => {
  const{ email, password, error, loading} = auth;
  return { email, password, error, loading};
};

export default connect(mapStateToProps, { textChanged }) (FindTicketForm);
